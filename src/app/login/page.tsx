import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
    title: 'Login - CrewForce OS',
    description: 'Infrastructure Management OS',
};

export default function LoginPage() {
    return (
        <main className="w-full flex-1 min-h-[100dvh] bg-background-light dark:bg-background-dark flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden relative z-10">
                <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg">
                        <span className="material-symbols-outlined text-3xl">construction</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">CrewForce</h1>
                    <p className="text-sm font-medium text-slate-500">Infrastructure Management OS</p>
                </div>

                <div className="p-8">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
