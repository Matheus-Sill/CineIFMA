"use server";

// app/actions/cinema.ts

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────
// FILMES
// ─────────────────────────────────────────────────────────────

/** Retorna os 4 filmes em cartaz com as sessões futuras de cada um */
export async function getFilmesEmCartaz() {
  const filmes = await prisma.filme.findMany({
    take: 4,
    include: {
      sessoes: {
        where: { data: { gte: new Date() } },
        orderBy: { data: "asc" },
      },
    },
  });

  return filmes;
}

/** Retorna um filme pelo ID com sessões futuras e cadeiras ocupadas */
export async function getFilmeById(filmeId: number) {
  const filme = await prisma.filme.findUnique({
    where: { id: filmeId },
    include: {
      sessoes: {
        where: { data: { gte: new Date() } },
        orderBy: { data: "asc" },
        include: {
          reservas: { select: { cadeira: true } },
        },
      },
    },
  });

  if (!filme) throw new Error("Filme não encontrado.");
  return filme;
}

// ─────────────────────────────────────────────────────────────
// SESSÃO
// ─────────────────────────────────────────────────────────────

/**
 * Retorna o mapa de cadeiras de uma sessão:
 * - quais estão ocupadas
 * - qual o usuário logado já reservou (se houver)
 */
export async function getSessaoDetalhes(sessaoId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado.");

  const sessao = await prisma.sessao.findUnique({
    where: { id: sessaoId },
    include: {
      filme: true,
      reservas: { select: { cadeira: true, usuarioId: true } },
    },
  });

  if (!sessao) throw new Error("Sessão não encontrada.");

  const cadeirasOcupadas = sessao.reservas.map((r) => r.cadeira);
  const minhaCadeira =
    sessao.reservas.find((r) => r.usuarioId === userId)?.cadeira ?? null;

  return {
    sessao: {
      id: sessao.id,
      data: sessao.data,
      filme: sessao.filme,
    },
    cadeirasOcupadas,
    minhaCadeira,
    totalCadeiras: 30,
  };
}

// ─────────────────────────────────────────────────────────────
// RESERVAR CADEIRA
// ─────────────────────────────────────────────────────────────

/**
 * Reserva uma cadeira para o usuário logado.
 * - Se ele já tem cadeira nessa sessão, troca automaticamente.
 * - Se outra pessoa pegou a cadeira no mesmo instante, lança erro amigável.
 */
export async function reservarCadeira(sessaoId: string, cadeira: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado.");

  if (cadeira < 1 || cadeira > 30)
    throw new Error("Cadeira inválida. Escolha entre 1 e 30.");

  const sessao = await prisma.sessao.findUnique({ where: { id: sessaoId } });
  if (!sessao) throw new Error("Sessão não encontrada.");
  if (sessao.data < new Date()) throw new Error("Essa sessão já ocorreu.");

  // Verifica se já tem reserva nessa sessão
  const reservaExistente = await prisma.reserva.findFirst({
    where: { sessaoId, usuarioId: userId },
  });

  if (reservaExistente) {
    if (reservaExistente.cadeira === cadeira) {
      return { sucesso: true, mensagem: "Você já está nessa cadeira." };
    }
    // Troca de cadeira: remove a antiga
    await prisma.reserva.delete({ where: { id: reservaExistente.id } });
  }

  try {
    const reserva = await prisma.reserva.create({
      data: { usuarioId: userId, sessaoId, cadeira },
    });

    revalidatePath("/catalogo");

    return {
      sucesso: true,
      reserva,
      mensagem: `Cadeira ${cadeira} reservada com sucesso!`,
    };
  } catch (err: any) {
    // Prisma unique constraint → outra pessoa reservou no mesmo instante
    if (err.code === "P2002") {
      throw new Error("Essa cadeira acabou de ser reservada. Escolha outra.");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// CANCELAR RESERVA
// ─────────────────────────────────────────────────────────────

export async function cancelarReserva(sessaoId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado.");

  const reserva = await prisma.reserva.findFirst({
    where: { sessaoId, usuarioId: userId },
  });

  if (!reserva) throw new Error("Você não tem reserva nessa sessão.");

  await prisma.reserva.delete({ where: { id: reserva.id } });

  revalidatePath("/catalogo");
  return { sucesso: true, mensagem: "Reserva cancelada." };
}

// ─────────────────────────────────────────────────────────────
// MINHAS RESERVAS
// ─────────────────────────────────────────────────────────────

/** Lista todos os ingressos do usuário logado, do mais recente ao mais antigo */
export async function minhasReservas() {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado.");

  return prisma.reserva.findMany({
    where: { usuarioId: userId },
    include: {
      sessao: { include: { filme: true } },
    },
    orderBy: { criadoEm: "desc" },
  });
}