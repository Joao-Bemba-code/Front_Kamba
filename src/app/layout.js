// src/app/layout.js
export const metadata = {
  title: "Kamba Project",
  description: "Sua plataforma de projetos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}