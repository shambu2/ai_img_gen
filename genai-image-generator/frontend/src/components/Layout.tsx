import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Palette, 
  Image, 
  Info, 
  Home,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Generate', href: '/generate', icon: Palette },
  { name: 'Gallery', href: '/gallery', icon: Image },
  { name: 'About', href: '/about', icon: Info },
]

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">GenAI Image Generator</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">GenAI</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 text-sm font-semibold leading-6 transition-colors ${
                    isActive 
                      ? 'text-primary-600' 
                      : 'text-gray-900 hover:text-primary-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">GenAI Image Generator</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">GenAI</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                            isActive 
                              ? 'bg-primary-50 text-primary-600' 
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://github.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 GenAI Hackathon Team. Built with ❤️ using AWS Bedrock and React.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}