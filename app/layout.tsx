import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Alfa_Slab_One, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const alfaSlabOne = Alfa_Slab_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-alfa-slab-one",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

export const metadata: Metadata = {
  title: "Apex Capital",
  description: "Apex Capital - Your Investment Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${montserrat.variable} ${alfaSlabOne.variable} ${cormorantGaramond.variable} `}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
import "./globals.css";

