import { SignInButton } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-zinc-950/70 via-zinc-950/80 to-zinc-950" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-black/60 backdrop-blur-md border border-zinc-800 px-10 py-14 shadow-2xl text-center">
        
        <div className="mb-10">
          <h1 className="text-6xl font-extrabold tracking-tight text-red-600 drop-shadow-xl">
            CineIFMA
          </h1>
          <p className="mt-4 text-base text-zinc-300 font-medium">
            Acesse para garantir seu ingresso
          </p>
        </div>

        <SignInButton forceRedirectUrl="/catalogo">
          <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-100/10 border border-zinc-600 p-4 text-lg font-semibold text-white hover:bg-zinc-100/20 hover:border-zinc-400 transition-all active:scale-[0.98]">
            
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>

            Continuar com o Google
          </button>
        </SignInButton>

        <div className="mt-10 text-sm text-zinc-400">
          Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </div>

      </div>
    </main>
  );
}