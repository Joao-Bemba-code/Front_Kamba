// components/Navbar.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleComecarAgora = () => {
        router.push('/auth/login');
    };

    const handleLinkClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        
        // Se for um link interno (começa com #), faz scroll suave
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Se for link externo, navega normalmente
            router.push(href);
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white hover:text-primary transition-colors">
                            KAMBA<span className="text-primary">BUSINESS</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link 
                            href="#about" 
                            className="text-sm font-medium text-white/90 hover:text-primary transition-colors"
                            onClick={(e) => handleLinkClick(e, '#about')}
                        >
                            Sobre Nós
                        </Link>
                        <Link 
                            href="#how-it-works" 
                            className="text-sm font-medium text-white/90 hover:text-primary transition-colors"
                            onClick={(e) => handleLinkClick(e, '#how-it-works')}
                        >
                            Como Funciona
                        </Link>
                        <Link 
                            href="#projects" 
                            className="text-sm font-medium text-white/90 hover:text-primary transition-colors"
                            onClick={(e) => handleLinkClick(e, '#projects')}
                        >
                            Projectos
                        </Link>
                        <button
                            onClick={handleComecarAgora}
                            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            Começar Agora
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={toggleMenu}
                            className="p-2 text-white/90 hover:text-primary focus:outline-none transition-colors"
                            aria-label="Menu"
                        >
                            <svg 
                                className="h-6 w-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div 
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-2 pt-2 pb-4 space-y-2 bg-slate-900/95 backdrop-blur-lg rounded-lg mt-2 border border-slate-800">
                        <Link 
                            href="#about" 
                            className="block px-3 py-2 text-base font-medium text-white/90 hover:text-primary hover:bg-slate-800/50 rounded-lg transition-all"
                            onClick={(e) => handleLinkClick(e, '#about')}
                        >
                            Sobre Nós
                        </Link>
                        <Link 
                            href="#how-it-works" 
                            className="block px-3 py-2 text-base font-medium text-white/90 hover:text-primary hover:bg-slate-800/50 rounded-lg transition-all"
                            onClick={(e) => handleLinkClick(e, '#how-it-works')}
                        >
                            Como Funciona
                        </Link>
                        <Link 
                            href="#projects" 
                            className="block px-3 py-2 text-base font-medium text-white/90 hover:text-primary hover:bg-slate-800/50 rounded-lg transition-all"
                            onClick={(e) => handleLinkClick(e, '#projects')}
                        >
                            Projectos
                        </Link>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleComecarAgora();
                            }}
                            className="w-full text-left px-3 py-2 text-base font-bold text-primary hover:text-primary/80 hover:bg-slate-800/50 rounded-lg transition-all"
                        >
                            Começar Agora
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 