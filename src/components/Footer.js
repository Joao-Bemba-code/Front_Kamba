// components/Footer.js
const Footer = () => (
    <footer className="bg-navy-dark border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <span className="text-2xl font-extrabold tracking-tighter text-white">KAMBA<span className="text-primary">BUSINESS</span></span>
                    <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                        A primeira plataforma de equity crowdfunding focada exclusivamente no mercado angolano. Excelência, transparência e retorno.
                    </p>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Plataforma</h5>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a className="hover:text-primary transition-colors" href="#">Projectos Atuais</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Como Investir</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Para Empreendedores</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Empresa</h5>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a className="hover:text-primary transition-colors" href="#">Sobre Nós</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Blog &amp; Notícias</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Contactos</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6">Legal</h5>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a className="hover:text-primary transition-colors" href="#">Termos de Uso</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Privacidade</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Riscos de Investimento</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-xs text-gray-600">
                <p>© 2025 Kamba Business. Todos os direitos reservados.</p>
                <div className="flex gap-6">
                    <a className="hover:text-white" href="#">LinkedIn</a>
                    <a className="hover:text-white" href="#">Instagram</a>
                    <a className="hover:text-white" href="#">Facebook</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;