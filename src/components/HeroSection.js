// components/HeroSection.js
const HeroSection = () => (
    <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img alt="Corporate Skyscraper" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc-R7ht239c-WzEdqrbZC9kR3Nyp9vCxzPfi07QSl7IG8nvlKAQUtHBvC8iuBh0FuDjWMX4n2zi5xiQvbl9US_m622eEliF7q3YMRWjgubN16Qo05TrimN9lqpUD4zMSDGP5X32qPJ1Ngzie93Q4eFquALglqbokEChhisOrCuzGP94kBulv580XJqYOzjSIvCONe4T_LSbNG-ekV7EiBMJSI9uo5FV1cSl_JHCfFM76avNaQ9zUa1EpKzykc5sjEdSL_-2kkW9gY" />
            <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-2xl animate-fade-in">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                    Elite Equity Crowdfunding Angola
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                    O Futuro do Crescimento é <span className="text-primary">Colectivo.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                    Democratizamos o acesso ao crescimento para empresas de alto potencial e permitimos que parceiros angolanos participem na construção de negócios extraordinários.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all shadow-lg shadow-primary/25" href="#projects">
                        Explorar Projectos
                    </a>
                    <a className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all backdrop-blur-sm" href="#">
                        Para Empresas
                    </a>
                </div>
            </div>
        </div>
        {/* Stats Floating Bar */}
        {/* Continue com a barra de estatísticas aqui */}
    </header>
);

export default HeroSection;