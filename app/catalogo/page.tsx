// app/catalogo/page.tsx
// Server Component — busca os dados e passa para os componentes do frontend

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFilmesEmCartaz } from "@/app/actions/cinema";
import type { FilmeComSessoes } from "@/app/types/cinema";

export default async function CatalogoPage() {
  // Redireciona para login se não autenticado
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const filmes: FilmeComSessoes[] = await getFilmesEmCartaz();

  return (
    <main>
      {/*
        PARA O FRONTEND:
        `filmes` é um array de até 4 itens com a forma:
        {
          id: number,
          titulo: string,
          poster: string,        ← URL da imagem do cartaz
          sessoes: [
            { id: string, data: Date },  ← cada sessão disponível
            ...
          ]
        }

        Sugestão de uso:
        <section className="grid grid-cols-4 gap-6">
          {filmes.map(filme => (
            <FilmeCard key={filme.id} filme={filme} />
          ))}
        </section>
      */}

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {filmes.map((filme) => (
          <div key={filme.id}>
            {/* Cartaz */}
            <img src={filme.poster} alt={filme.titulo} style={{ width: "100%" }} />

            {/* Título */}
            <h2>{filme.titulo}</h2>

            {/* Sessões disponíveis */}
            <ul>
              {filme.sessoes.map((sessao) => (
                <li key={sessao.id}>
                  {new Date(sessao.data).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" — "}
                  {/* Link para a página de seleção de cadeiras */}
                  <a href={`/catalogo/${filme.id}/sessao/${sessao.id}`}>
                    Escolher cadeira
                  </a>
                </li>
              ))}
            </ul>

            {filme.sessoes.length === 0 && (
              <p>Sem sessões disponíveis no momento.</p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}