import { Inter, JetBrains_Mono, Montserrat, Noto_Sans } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/ui/VideoBackground";
import { AuthProvider } from "@/contexts/AuthContext";
import { SkillsProvider } from "@/contexts/SkillsContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "Jérémie Marie - Le Développeur Full-Stack que vous allez recruter.",
  description: "Portfolio de Jérémie Marie, développeur Full-Stack spécialisé en React, Next.js, Node.js, déjà prêt pour l'onboarding.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${notoSans.variable} antialiased`} style={{ backgroundColor: "#121212", color: "#ffffff" }}>
        <AuthProvider>
          <SkillsProvider>
            <ProjectsProvider>
              <VideoBackground />
              {children}
            </ProjectsProvider>
          </SkillsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
