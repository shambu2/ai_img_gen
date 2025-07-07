import { Sparkles } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <div className=" ">
        <div className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">ContentGen</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Demo
              </a>
              {/* <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a> */}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
        
      </div>
  )
}

export default Navbar