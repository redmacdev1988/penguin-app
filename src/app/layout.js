import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { MyThemeProvider } from "@/context/MyThemeContext"
import { GlobalProvider } from "@/context/GlobalContext"
import AuthProvider from "@/components/AuthProvider/AuthProvider";


export const metadata = {
  title: 'RickyABC English tutorials',
  description: 'English tutorials created by RickyABC',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <GlobalProvider>
            <MyThemeProvider>
              <AuthProvider>
                <div className="container">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              </AuthProvider>
            </MyThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
