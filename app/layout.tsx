import { Analytics } from '@vercel/analytics/react'
import "./globals.css"

export const metadata = {
  title: "Sketch TOP DEALS",
  description: "Les meilleures offres de meubles au Maroc",
  icons: {
    icon: [
      {
        url: "/topdeal.svg",
        href: "/topdeal.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
