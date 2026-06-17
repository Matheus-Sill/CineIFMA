"use client";

import { useState, useTransition } from "react";
import { reservarCadeira, cancelarReserva } from "@/app/actions/cinema";
import type { SessaoDetalhada } from "@/app/types/cinema";

type Props = { detalhes: SessaoDetalhada };

export function SeletorCadeiras({ detalhes }: Props) {
  const { sessao, cadeirasOcupadas, totalCadeiras } = detalhes;

  const [selecionada, setSelecionada] = useState<number | null>(detalhes.minhaCadeira);
  const [confirmada, setConfirmada] = useState<number | null>(detalhes.minhaCadeira);
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
        setSelecionada(confirmada);
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
    <div className="flex flex-col items-center">
      
      {/* ── Representação da Tela do Cinema ── */}
      <div className="mb-12 w-full max-w-md perspective-midrange">
        <div className="h-8 w-full rounded-t-[50%] bg-zinc-300 shadow-[0_-15px_30px_rgba(255,255,255,0.1)] transform-[rotateX(-15deg)]"></div>
        <p className="mt-2 text-center text-xs font-bold tracking-[0.3em] text-zinc-500">TELA</p>
      </div>

      {/* ── Grade de cadeiras ── */}
      <div className="mb-12 grid grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {cadeiras.map((num) => {
          const estado = getEstado(num);
          
          // Lógica de CSS condicional baseada no estado da cadeira
          let btnClasses = "relative w-10 h-10 sm:w-12 sm:h-12 rounded-t-lg rounded-b-sm font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center border-b-4 ";
          
          if (estado === "ocupada") {
            btnClasses += "bg-zinc-800 text-zinc-600 border-zinc-900 cursor-not-allowed opacity-50";
          } else if (estado === "confirmada") {
            btnClasses += "bg-green-600 text-white border-green-800 shadow-[0_0_15px_rgba(22,163,74,0.4)]";
          } else if (estado === "selecionada") {
            btnClasses += "bg-red-600 text-white border-red-800 scale-110 shadow-[0_0_15px_rgba(229,9,20,0.6)]";
          } else {
            btnClasses += "bg-zinc-700 text-zinc-300 border-zinc-800 hover:bg-zinc-600 hover:text-white cursor-pointer";
          }

          return (
            <button
              key={num}
              disabled={estado === "ocupada" || isPending}
              onClick={() => handleClicar(num)}
              className={btnClasses}
              title={`Cadeira ${num}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* ── Legenda ── */}
      <div className="mb-10 flex flex-wrap justify-center gap-6 rounded-full bg-zinc-950/50 px-6 py-3 text-sm font-medium text-zinc-400 border border-zinc-800">
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-zinc-700"></div> Livre</div>
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-zinc-800 opacity-50"></div> Ocupada</div>
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-red-600"></div> Selecionada</div>
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-green-600"></div> Sua reserva</div>
      </div>

      {/* ── Ações (Botões Confirmar / Cancelar) ── */}
      <div className="flex flex-col sm:flex-row w-full max-w-sm gap-4">
        {selecionada && selecionada !== confirmada && (
          <button 
            onClick={handleConfirmar} 
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-600 py-4 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Reservando..." : `Confirmar Cadeira ${selecionada}`}
          </button>
        )}

        {confirmada && (
          <button 
            onClick={handleCancelar} 
            disabled={isPending}
            className="flex-1 rounded-xl bg-zinc-800 py-4 font-bold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
          >
            {isPending ? "Processando..." : `Cancelar Reserva`}
          </button>
        )}
      </div>

      {/* ── Feedback de Alertas ── */}
      <div className="mt-6 w-full max-w-sm">
        {mensagem && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center text-sm font-medium text-green-400">
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center text-sm font-medium text-red-400">
            {erro}
          </div>
        )}
      </div>

    </div>
  );
}