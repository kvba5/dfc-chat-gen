import type { Metadata, Viewport } from "next";

import "./globals.css";

import localFont from "next/font/local"


const determinationMono = localFont({
  src: "../../public/font/DeterminationSansWebRegular.ttf"
})

const monsterFriendFore = localFont({
  src: "../../public/font/MonsterFriendFore.ttf",
  variable: "--font-monsterfriendfore"
})

const troubleBenathTheDome = localFont({
  src: "../../public/font/TroubleBenathTheDome.ttf",
  variable: "--font-toublebenaththedome"
})

export const metadata: Metadata = {
  title: "DF Chat Generator",
  description: "Generate any DF-like message you like!",
  keywords: ["kvba", "df", "dontforget", "undertale", "deltarune", "dialog generator", "dialog gen", "chat generator", "rpg"],
  openGraph: {
    title: "DF Chat Generator",
    description: "Generate any DF-like message you like!"
  },
  twitter: {
    card: "summary_large_image",
  },
  authors: [
    {
      name: "kvba5",
      url: "https://meowpa.ws"
    }
  ]
};

export const viewport: Viewport = {
  themeColor: "#e603ff",
  colorScheme: "dark"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${determinationMono.className} ${monsterFriendFore.variable} ${troubleBenathTheDome.variable}`}>
      <body>{children}</body>
    </html>
  );
}
