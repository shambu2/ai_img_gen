import { Link } from 'react-router-dom'
import { Palette, Zap, Shield, Sparkles, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-accent-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create Stunning Images with{' '}
              <span className="gradient-text">AI Magic</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your ideas into beautiful artwork using the power of AWS Bedrock and advanced diffusion models. 
              Generate high-quality images from text prompts with style customization and ethical AI practices.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/generate"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/gallery"
                className="btn btn-outline text-lg px-8 py-3"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent-600 to-primary-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Advanced AI Technology</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create amazing images
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Powered by AWS Bedrock's state-of-the-art diffusion models, our platform offers 
            unparalleled image generation capabilities with ethical AI practices.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Palette className="h-5 w-5 flex-none text-primary-600" />
                Multiple AI Models
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Choose from Stable Diffusion XL, Titan Image Generator, and more. Each model offers unique 
                  capabilities for different artistic styles and use cases.
                </p>
              </dd>
            </div>
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Zap className="h-5 w-5 flex-none text-primary-600" />
                Lightning Fast
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Optimized for speed with AWS infrastructure. Generate high-quality images in seconds 
                  with our efficient processing pipeline.
                </p>
              </dd>
            </div>
            
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <Shield className="h-5 w-5 flex-none text-primary-600" />
                Ethical AI
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Built with responsible AI principles. Content moderation, bias detection, and 
                  compliance with EU AI Act and ethical guidelines.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by creators worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join thousands of artists, designers, and creators who trust our platform
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Images Generated</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">10M+</dd>
              </div>
              <div className="flex flex-col bg-white p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Active Users</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">50K+</dd>
              </div>
              <div className="flex flex-col bg-white p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">AI Models</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">3+</dd>
              </div>
              <div className="flex flex-col bg-white p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Uptime</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900">99.9%</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create your masterpiece?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
              Start generating stunning images with our advanced AI models. 
              Join the creative revolution today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/generate"
                className="btn btn-primary bg-white text-gray-900 hover:bg-gray-100"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-white"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#3B82F6" />
                  <stop offset={1} stopColor="#D946EF" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}