"use client";

// app/catalogo/[filmeId]/sessao/[sessaoId]/SeletorCadeiras.tsx
// Client Component — gerencia a seleção e reserva de cadeiras

import { useState, useTransition } from "react";
import { reservarCadeira, cancelarReserva } from "@/app/actions/cinema";
import type { SessaoDetalhada } from "@/app/types/cinema";

type Props = { detalhes: SessaoDetalhada };

export function SeletorCadeiras({ detalhes }: Props) {
  const { sessao, cadeirasOcupadas, totalCadeiras } = detalhes;

  // Cadeira selecionada localmente (antes de confirmar)
  const [selecionada, setSelecionada] = useState<number | null>(
    detalhes.minhaCadeira
  );
  // Cadeira confirmada no banco
  const [confirmada, setConfirmada] = useState<number | null>(
    detalhes.minhaCadeira
  );
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function getEstado(num: number): "livre" | "ocupada" | "selecionada" | "confirmada" {
    if (num === confirmada) return "confirmada";
    if (num === selecionada) return "selecionada";
    if (cadeirasOcupadas.includes(num)) return "ocupada";
    return "livre";
  }

  function handleClicar(num: number) {
    if (cadeirasOcupadas.includes(num) && num !== confirmada) return;
    setErro(null);
    setMensagem(null);
    setSelecionada(num === selecionada ? null : num);
  }

  function handleConfirmar() {
    if (!selecionada) return;

    startTransition(async () => {
      try {
        const res = await reservarCadeira(sessao.id, selecionada);
        setConfirmada(selecionada);
        setMensagem(res.mensagem);
        setErro(null);
      } catch (err: any) {
        setErro(err.message);
        setSelecionada(confirmada); // volta para a confirmada anterior
      }
    });
  }

  function handleCancelar() {
    startTransition(async () => {
      try {
        const res = await cancelarReserva(sessao.id);
        setConfirmada(null);
        setSelecionada(null);
        setMensagem(res.mensagem);
        setErro(null);
      } catch (err: any) {
        setErro(err.message);
      }
    });
  }

  const cadeiras = Array.from({ length: totalCadeiras }, (_, i) => i + 1);

  return (
    <div>
      {/* ── Legenda ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <span data-legenda="livre">Livre</span>
        <span data-legenda="ocupada">Ocupada</span>
        <span data-legenda="selecionada">Selecionada</span>
        <span data-legenda="confirmada">Sua reserva</span>
      </div>

      {/* ── Grade de cadeiras (6 colunas × 5 linhas = 30) ── */}
      {/*
        PARA O FRONTEND:
        Cada botão tem data-estado="livre|ocupada|selecionada|confirmada"
        Estilize via CSS:
          [data-estado="livre"]       → cor neutra
          [data-estado="ocupada"]     → vermelho / desabilitado
          [data-estado="selecionada"] → azul / destacado
          [data-estado="confirmada"]  → verde / confirmado
      */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 48px)",
          gap: 8,
        }}
      >
        {cadeiras.map((num) => {
          const estado = getEstado(num);
          return (
            <button
              key={num}
              data-estado={estado}
              disabled={estado === "ocupada" || isPending}
              onClick={() => handleClicar(num)}
              style={{ width: 48, height: 48 }}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* ── Ações ── */}
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        {selecionada && selecionada !== confirmada && (
          <button onClick={handleConfirmar} disabled={isPending}>
            {isPending ? "Reservando..." : `Confirmar cadeira ${selecionada}`}
          </button>
        )}

        {confirmada && (
          <button onClick={handleCancelar} disabled={isPending}>
            {isPending ? "Cancelando..." : `Cancelar reserva (cadeira ${confirmada})`}
          </button>
        )}
      </div>

      {/* ── Feedback ── */}
      {mensagem && <p data-feedback="sucesso">{mensagem}</p>}
      {erro && <p data-feedback="erro">{erro}</p>}
    </div>
  );
}