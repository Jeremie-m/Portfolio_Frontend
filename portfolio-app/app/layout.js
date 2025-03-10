import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Jérémie Marie - Développeur Full Stack",
  description: "Portfolio de Jérémie Marie, développeur Full Stack spécialisé en React, Next.js, Node.js et plus encore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} antialiased`} style={{ backgroundColor: "#121212", color: "#ffffff" }}>
        {children}
      </body>
    </html>
  );
}
