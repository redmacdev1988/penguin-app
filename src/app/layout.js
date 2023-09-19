import './globals.css'
import { Inter, Roboto, Poppins } from 'next/font/google'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { ThemeProvider } from "@/context/ThemeContext"
import { GlobalProvider } from "@/context/GlobalContext"
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RickyABC English tutorials',
  description: 'English tutorials created by RickyABC',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="container">
                <Navbar />
                {children}
                <Footer />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
