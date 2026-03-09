// src/app/auth/login/page.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import axios from "axios";

const Login = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [Email, setEmail] = useState("");
    const [Senha, setSenha] = useState("");
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Corrigido: login deve ser POST, não GET
            const res = await axios.post("http://localhost:8080/auth/login", {
                Email: Email,
                Senha: Senha
            });

            setMessage(res.data.msg || "Login realizado com sucesso!");
            setMessageType('success');
            
            // Limpar campos após sucesso (opcional)
            setEmail("");
            setSenha("");
            
            // Aqui você pode redirecionar o usuário para a página principal
            // router.push('/dashboard'); // se estiver usando next/router

        } catch (error) {
            const mensagemErro = error.response?.data?.msg || error.message || "Erro ao fazer login";
            
            setMessage(mensagemErro);
            setMessageType('error');
        }
    }

    const handleInputFocus = () => {
        setIsButtonVisible(true);
    };

    return (
        <>
            <Head>
                <title>KAMBABUSINESS | Login Corporativo</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" />
            </Head>
            <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-0 md:p-6">
                <div className="flex w-full max-w-[1200px] min-h-[80vh] bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-200 dark:border-slate-800">
                    {/* Left Side: Form Section */}
                    <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16">
                        <header className="mb-12">
                            <div className="flex items-center gap-2 text-primary dark:text-accent mb-8">
                                <div className="size-8 bg-primary dark:bg-accent rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-xl">account_balance</span>
                                </div>
                                <h2 className="text-xl font-bold leading-tight tracking-tight">KAMBABUSINESS</h2>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Aceder à sua conta</h1>
                            <p className="text-slate-500 dark:text-slate-400">Introduza os seus dados corporativos para continuar.</p>
                        </header>

                        {/* Message Display - Adicionado do componente Register */}
                        {message && (
                            <div className={`p-4 mb-4 text-sm ${messageType === 'success' ? 'text-green-700 bg-green-100 border border-green-400 border-dashed' : 'text-red-700 bg-red-100 border border-red-400 border-dashed'} rounded`}>
                                {message}
                            </div>
                        )}
                        
                        <form className="space-y-6 flex-grow" onSubmit={handleSubmit} aria-label="Formulário de Login">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">
                                    E-mail Corporativo
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full px-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                                        id="email"
                                        value={Email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        placeholder="exemplo@empresa.ao"
                                        type="email"
                                        required
                                        onFocus={handleInputFocus} 
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                                        Palavra-passe
                                    </label>
                                </div>
                                <div className="relative flex items-center">
                                    <input
                                        className="w-full px-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none placeholder:text-slate-400 pr-12"
                                        id="password"
                                        name="password"
                                        value={Senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="••••••••"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        required
                                        onFocus={handleInputFocus} 
                                    />
                                    <button
                                        className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label="Mostrar senha"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {isPasswordVisible ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {isButtonVisible && (
                                <button
                                    className="w-full bg-blue-600 dark:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-slate-200 dark:shadow-none mt-4"
                                    type="submit"
                                >
                                    Entrar
                                </button>
                            )}
                        </form>
                        <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                Ainda não tem acesso?
                                <a className="text-accent font-bold hover:underline ml-1" href="/auth/register">Criar Conta</a>
                            </p>
                        </footer>
                    </div>

                    {/* Right Side: Visual Section */}
                    <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary">
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-900 to-accent"></div>
                        </div>
                        <img
                            alt="Modern Corporate Building Architecture"
                            className="absolute inset-0 w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXM4lfuKdh8y9nRwEZlaTo1Y5sf-GauDe0iWUxRrT_YZhuadOs2HLqRaG9P1kKAY0CxojbOl6nGcscL0X8V8WMPIBQncNtZZmNQ1DW-dQ1evLUUIL0hDY-0ksf66sYR7_-L9a-zb0nG-CcyYRcycb_wVbwVE9TFm8OkonZizhODYhcN5izjJmmJhAQLmtOtizgkd1_JHTZdhYdLS7dUkZVHZSY-KmXQeNErYlVzN2ixKiX0grU7o-slXbKjwLmeAvbt3WCw-7_Hoc"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;