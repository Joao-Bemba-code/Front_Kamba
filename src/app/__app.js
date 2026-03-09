// pages/_app.js
import './globals.css'; // Adicione a sua importação de estilos globais
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        document.body.classList.add("bg-navy-dark", "text-white", "font-sans", "antialiased");
    }, []);
    
    return <Component {...pageProps} />;
}

export default MyApp;