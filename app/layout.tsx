import type React from "react"
import { Nunito } from "next/font/google"
import Image from "next/image"
import "./globals.css"

// Import the Providers component
import { Providers } from "./providers"
import Header from "./components/header"
import { Suspense } from "react"
import HeaderWithPremium from "./components/header-with-premium"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
})

export const metadata = {
  title: "SmartStart - 尋找最適合您孩子的學校",
  description: "SmartStart 幫助家長尋找、比較和選擇最適合他們孩子的學校。",
    generator: 'v0.dev'
}

// Fallback header in case the server component fails
function HeaderFallback() {
  return <Header showPremiumLink={false} />
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK">
      <body className={`${nunito.className} min-h-screen bg-[#FAFAFA]`}>
        <Providers>
          <Suspense fallback={<HeaderFallback />}>
            {/* @ts-expect-error Server Component */}
            <HeaderWithPremium />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <footer className="bg-[#294F91] text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image__18_-removebg-preview-0qIZyufUHFapDCG70EkUnc2ia5wvVd.png"
                      alt="SmartStart Logo"
                      width={150}
                      height={50}
                      className="h-auto"
                    />
                  </div>
                  <p className="text-white/80">幫助家長尋找最適合他們孩子的學校。</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">快速連結</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/schools" className="text-white/80 hover:text-white">
                        學校搜尋
                      </a>
                    </li>
                    <li>
                      <a href="/subscription" className="text-white/80 hover:text-white">
                        訂閱計劃
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="text-white/80 hover:text-white">
                        關於我們
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">聯絡我們</h3>
                  <ul className="space-y-2">
                    <li className="text-white/80">電子郵件: support@smartstart.one</li>
                    <li className="text-white/80">電話: +852 1234 5678</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">關注我們</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-white/80 hover:text-white">
                      Facebook
                    </a>
                    <a href="#" className="text-white/80 hover:text-white">
                      Instagram
                    </a>
                    <a href="#" className="text-white/80 hover:text-white">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80">
                <p>&copy; {new Date().getFullYear()} SmartStart. 版權所有。</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
