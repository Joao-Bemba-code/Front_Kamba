// components/HowItWorksSection.js
const HowItWorksSection = () => (
    <section className="py-24 bg-navy-dark" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Como Investir na <span className="text-primary">KambaBusiness</span></h2>
                    <div className="space-y-10">
                        {['Crie a sua Conta', 'Analise Projectos', 'Invista e Acompanhe'].map((step, index) => (
                            <div className="flex gap-6" key={index}>
                                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary font-bold text-xl">{index + 1}</div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">{step}</h4>
                                    <p className="text-gray-400">
                                        {index === 0 && "Registe-se em minutos e complete o seu perfil de investidor para aceder a oportunidades exclusivas."}
                                        {index === 1 && "Examine o Business Plan, as projeções financeiras e a equipa por trás de cada empresa na nossa plataforma."}
                                        {index === 2 && "Escolha o valor, assine digitalmente e acompanhe o crescimento da sua participação através do seu dashboard."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                    <img alt="Dashboard Preview" className="relative rounded-2xl border border-white/10 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlbdUxkUzpDI6b9Suh5_dKzwzATipDoBfE6NLCE9fQcHqGsP_1uV0MBQuHzwgESfp1KtMyDP-iNJf5uyGMsXoeHj1f6yqTvTllr7zpM2a4RgQ4nCXfcM4lBHcmQfprYl0EAiCmw14QgrOnhDitkiTBu65v4CCvEnDbXUmiXB7VfNVosTySJgV8xA5E4C7KT7k_OKGcnkPKManjvixKpPZ03nirEaQRArcb6DKVr7yvcwiJNSK0zk4PyFLO7z5B6vshgDlCveALOD4" />
                </div>
            </div>
        </div>
    </section>
);

export default HowItWorksSection;