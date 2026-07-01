
CREATE TABLE IF NOT EXISTS "Filme" (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  poster TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Sessao" (
  id TEXT PRIMARY KEY,
  "filmeId" INTEGER NOT NULL REFERENCES "Filme"(id),
  data TIMESTAMP NOT NULL,
  UNIQUE("filmeId", data)
);

CREATE TABLE IF NOT EXISTS "Reserva" (
  id TEXT PRIMARY KEY,
  "usuarioId" TEXT NOT NULL,
  "sessaoId" TEXT NOT NULL REFERENCES "Sessao"(id),
  cadeira INTEGER NOT NULL,
  "criadoEm" TIMESTAMP DEFAULT NOW(),
  UNIQUE("sessaoId", cadeira)
);

-- Filmes em cartaz
INSERT INTO "Filme" (titulo, poster) VALUES
('Filme 1', 'https://placehold.co/300x450?text=Filme+1'),
('Filme 2', 'https://placehold.co/300x450?text=Filme+2'),
('Filme 3', 'https://placehold.co/300x450?text=Filme+3'),
('Filme 4', 'https://placehold.co/300x450?text=Filme+4');

-- Sessões futuras (30 dias a partir da criação do container)
INSERT INTO "Sessao" (id, "filmeId", data) VALUES
(gen_random_uuid()::text, 1, NOW() + INTERVAL '1 day'),
(gen_random_uuid()::text, 2, NOW() + INTERVAL '1 day'),
(gen_random_uuid()::text, 3, NOW() + INTERVAL '1 day'),
(gen_random_uuid()::text, 4, NOW() + INTERVAL '1 day');
