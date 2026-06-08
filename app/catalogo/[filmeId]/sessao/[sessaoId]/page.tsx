
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSessaoDetalhes } from "@/app/actions/cinema";
import { SeletorCadeiras } from "./SeletorCadeiras";

type Props = {
  params: Promise<{ filmeId: string; sessaoId: string }>; 
};

export default async function SessaoPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { sessaoId } = await params; 

  const detalhes = await getSessaoDetalhes(sessaoId);

  return (
    <main>
      <h1>{detalhes.sessao.filme.titulo}</h1>
      <p>
        {new Date(detalhes.sessao.data).toLocaleString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <SeletorCadeiras detalhes={detalhes} />
    </main>
  );
}


