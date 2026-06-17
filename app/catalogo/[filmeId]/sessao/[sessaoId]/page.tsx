import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSessaoDetalhes } from "@/app/actions/cinema";
import { SeletorCadeiras } from "./SeletorCadeiras";
import Link from "next/link";

type Props = {
  params: Promise<{ filmeId: string; sessaoId: string }>; 
};

export default async function SessaoPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { sessaoId } = await params; 
  const detalhes = await getSessaoDetalhes(sessaoId);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 md:p-12 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        
        {/* Botão Voltar */}
        <Link href="/catalogo" className="mb-6 inline-flex items-center text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao catálogo
        </Link>

        {/* Cabeçalho da Sessão */}
        <div className="mb-10 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            {detalhes.sessao.filme.titulo}
          </h1>
          <p className="text-lg text-red-500 font-medium flex items-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(detalhes.sessao.data).toLocaleString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Mapa de Cadeiras */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-10 shadow-lg">
          <SeletorCadeiras detalhes={detalhes} />
        </div>

      </div>
    </main>
  );
}