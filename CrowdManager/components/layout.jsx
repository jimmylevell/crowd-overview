import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          {children}
        </div>
      </main>

      <Footer />
    </>
  )
}
