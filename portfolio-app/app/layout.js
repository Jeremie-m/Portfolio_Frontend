import localFont from "next/font/local";
import "./globals.css";
import VideoBackground from "@/components/layout/VideoBackground";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { SkillsProvider } from "@/features/skills/contexts/SkillsContext";
import { ProjectsProvider } from "@/features/projects/contexts/ProjectsContext";

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-VariableFont_opsz,wght.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const jetbrainsMono = localFont({
  src: [
    {
      path: './fonts/JetBrainsMono-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-jetbrains-mono',
});

const montserrat = localFont({
  src: [
    {
      path: './fonts/Montserrat-VariableFont_wght.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-montserrat',
});

const notoSans = localFont({
  src: [
    {
      path: './fonts/NotoSans-VariableFont_wdth,wght.ttf',
      weight: '100 900',
      style: 'normal',
    }
  ],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans',
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
