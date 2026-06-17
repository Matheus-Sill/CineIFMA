import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"; 
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineIFMA",
  description: "Sistema de reserva de ingressos",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className="bg-zinc-950 text-zinc-100 antialiased">
          
          {userId && (
            <header className="flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-8 py-4 backdrop-blur-md">
              <span className="text-xl font-bold text-red-600 tracking-tight">CineIFMA</span>
              
              <UserButton />
            </header>
          )}

          {children}

        </body>
      </html>
    </ClerkProvider>
  );
}