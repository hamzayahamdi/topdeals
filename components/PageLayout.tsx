import Image from 'next/image'
import Header from './Header'

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Background gradient that matches header */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-white pointer-events-none" />
      
      {/* Sketch logo - sticky but behind content */}
      <div className="fixed top-[80px] w-full flex justify-center pointer-events-none" style={{ zIndex: 0 }}>
        <div className="relative w-full max-w-[300px] md:max-w-[450px] lg:max-w-[600px] aspect-[3/1]">
          <Image
            src="https://zruplcd5sfldkzdm.public.blob.vercel-storage.com/SketchDesign.svg"
            alt="Sketch Design"
            fill
            priority
            className="object-contain brightness-0 invert opacity-20"
          />
        </div>
      </div>
      
      <Header />
      
      {/* Responsive spacing for mobile */}
      <div className="h-[180px] md:h-[220px] lg:h-[240px]" />
      
      {/* Content */}
      <div className="relative flex-1 container mx-auto px-4" style={{ zIndex: 1 }}>
        {children}
      </div>
    </main>
  )
} 