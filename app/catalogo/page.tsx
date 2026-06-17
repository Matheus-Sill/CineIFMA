import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFilmesEmCartaz } from "@/app/actions/cinema";
import type { FilmeComSessoes } from "@/app/types/cinema";
import Link from "next/link";
import Image from "next/image"; // Importando o componente Image

export default async function CatalogoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const filmes: FilmeComSessoes[] = await getFilmesEmCartaz();

  return (
    <main className="min-h-screen bg-zinc-950 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Título da Página */}
        <div className="mb-10 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold text-white">Em Cartaz</h1>
        </div>

        {/* Grade de Filmes */}
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filmes.map((filme) => (
            <div 
              key={filme.id} 
              className="group flex flex-col overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-600 hover:shadow-red-900/20"
            >
              {/* Cartaz com Next/Image */}
            <div className="relative aspect-2/3 w-full bg-zinc-800 overflow-hidden">
            <img 
              src={filme.poster} 
              alt={filme.titulo} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-xl" 
              />
            </div>

              {/* Informações do Filme */}
              <div className="flex grow flex-col p-5">
                <h2 className="mb-4 text-xl font-bold text-zinc-100 line-clamp-2">
                  {filme.titulo}
                </h2>

                {/* Sessões disponíveis */}
                <div className="mt-auto flex flex-col gap-2">
                  {filme.sessoes.length > 0 ? (
                    filme.sessoes.map((sessao) => (
                      <Link 
                        key={sessao.id}
                        href={`/catalogo/${filme.id}/sessao/${sessao.id}`}
                        className="flex w-full items-center justify-center rounded-lg bg-zinc-800 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        Sessão — {new Date(sessao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500 italic text-center py-3">Sem sessões disponíveis.</p>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}