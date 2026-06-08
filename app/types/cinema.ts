// app/types/cinema.ts

export type FilmeComSessoes = {
  id: number;
  titulo: string;
  poster: string;
  sessoes: SessaoResumida[];
};

export type SessaoResumida = {
  id: string;
  filmeId: number;
  data: Date;
};

export type SessaoDetalhada = {
  sessao: {
    id: string;
    data: Date;
    filme: { id: number; titulo: string; poster: string };
  };
  cadeirasOcupadas: number[];  // ex: [3, 7, 21] → frontend pinta como ocupadas
  minhaCadeira: number | null; // null = usuário ainda não reservou
  totalCadeiras: number;       // sempre 30
};

export type ReservaComSessao = {
  id: string;
  cadeira: number;
  criadoEm: Date;
  sessao: {
    id: string;
    data: Date;
    filme: { id: number; titulo: string; poster: string };
  };
};