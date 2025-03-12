import { Inter, JetBrains_Mono, Montserrat, Noto_Sans } from "next/font/google";
import ClientLayout from './ClientLayout';
import { metadata } from './metadata';

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

export { metadata };

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${notoSans.variable}`}>
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}