// components/FeaturedProjectsSection.js
const FeaturedProjectsSection = () => (
    <section className="py-24 bg-navy-light" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Oportunidades de Investimento</h2>
                    <p className="text-gray-400">Projectos selecionados para investidores que procuram impacto e retorno.</p>
                </div>
                <a className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all" href="#">
                    Ver todos os projectos 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[ 
                    {
                        title: "AgroDigital Huíla",
                        progress: 75,
                        amount: "45.000.000 Kz",
                        goal: "60M Kz",
                        daysRemaining: "24 Dias Restantes",
                        description: "Modernização da cadeia de frio para pequenos agricultores no sul de Angola.",
                        category: "Tech & Agro",
                        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJjIAHKDLcFUhS4q7qGEzvuC8yG-rgEtW4Cv7CXuWwpgfJzCXtvmBzkISmsj_-4n2rvNc25FeC3LSUfHu_02PdKvOZ1FCPXeiGJQxyhZy8BwGfGnEF76vPQhDI7bvyNv2eH6ouagi_BtHbGf2fXmoMmtjlcg-oulF-u-G8UvAeAckoVqiarLCz_VQxIUaThZpHlYHJaBjhmEVghN-84tthHzBsVw655yeogrGZXAZP_E8uoW8dGWoKSte0OWsQmAr58e91AfKbcKg"
                    },
                    {
                        title: "BioTech Angola",
                        progress: 65,
                        amount: "22.750.000 Kz",
                        goal: "35M Kz",
                        daysRemaining: "15 Dias Restantes",
                        description: "Soluções biotecnológicas sustentáveis para o fortalecimento da agricultura orgânica em Angola.",
                        category: "Sustentabilidade",
                        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-tQK7bbyiTI1CkeoiRuuPe76KnhBwxrO7FlUy1V7uT7D8dcOBg7VrByaFesxsnRSOuYVysdbZagwyBEDlzuKueAesI1aaEniZ-mmFGnnwhSrP2tmtqCv-tSpKfu-zmrkouEi8AXNmhGTA-DiYX-gHiqeWxvCIXdNATcQ9SL9rodUYbxqPZOl1Tzwsw84iuk7IHI1PlJ26IDkxts9KDbh0fFoI7TpBJMCJ5vr7zVSCydEoiVFUKVoB9c-335LFJZ-mk2HwJape6Lw"
                    },
                    {
                        title: "Sol de Benguela",
                        progress: 92,
                        amount: "92.000.000 Kz",
                        goal: "100M Kz",
                        daysRemaining: "5 Dias Restantes",
                        description: "Implementação de painéis solares em zonas residenciais de expansão.",
                        category: "Energia",
                        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuATmTunr4r4q2jQVwX96atkfhJlQgDAzRfzCrZW3lcaGw55BSjpH-ld-UWkhbn2pM9psJSLAYBcUcLChEAcy4LPc6k-222YJYAu4kl9y-iFEq4NxXguwDiEaQiCQb7yj0xz8HQz9IhGXeQQ4ybxJ8ATseTIbeBTOE6qqsoUhJPKQaq2QXoP3ja4yYp3Uj-cQUlg61x-DdNUc0VDNvJ3hpAHykoePtl0sZTHFSr6c4E4KrZheT2eQzk33AmGcryhDVv77gFUAMgDsXk"
                    }
                ].map((project, index) => (
                    <div className="bg-navy-dark rounded-2xl overflow-hidden border border-white/5 flex flex-col h-full hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl" key={index}>
                        <div className="relative h-48">
                            <img alt={project.title} className="w-full h-full object-cover" src={project.imageUrl} />
                            <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">{project.category}</span>
                        </div>
                        <div className="p-6 flex-grow">
                            <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{project.title}</h4>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-gray-400 uppercase">Progresso ({project.progress}%)</span>
                                    <span className="text-white">{project.amount}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Meta: {project.goal}</span>
                                    <span>{project.daysRemaining}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5">
                            <button className="w-full bg-white/5 hover:bg-primary text-white font-bold py-3 rounded-xl transition-colors text-sm">Ver Detalhes</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeaturedProjectsSection;