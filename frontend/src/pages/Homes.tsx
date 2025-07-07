import {
  ArrowRight,
  Check,
  ChevronDown,
  Instagram,
  Loader2,
  Sparkles,
  Star,
  Target,
  Users,
  Youtube,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Homes = () => {
//   const [loadingStates, setLoadingStates] = useState({
//     instagram: false,
//     youtube: false,
//   });

  const navigate = useNavigate();

  const handleNavigation = (link: string) => {
    navigate(`/${link}`);
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6">
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
              
              <button onClick={()=>handleNavigation("instagram")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="min-h-[90vh] relative z-10 px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Generate Viral
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                {" "}
                Social Content
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Create engaging Instagram posts and YouTube content with
              AI-powered generation. Stand out from the crowd with
              professional-quality content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Try Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose ContentGen?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to help you create content that
              converts and engages your audience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/70 transition-all">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-slate-300">
                Generate high-quality content in seconds with our advanced AI
                algorithms
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/70 transition-all">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Targeted Content
              </h3>
              <p className="text-slate-300">
                Create content optimized for specific platforms and audiences
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 hover:bg-slate-800/70 transition-all">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Proven Results
              </h3>
              <p className="text-slate-300">
                Join thousands of creators who've increased their engagement by
                300%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Try It Now
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the power of AI-generated content creation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Instagram Generator */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all group">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Instagram
                </h3>
                <p className="text-slate-300">
                  Create engaging posts, stories, and captions
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Viral hashtag suggestions</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Caption optimization</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Story templates</span>
                </div>
              </div>

              <button
                onClick={() => handleNavigation("instagram")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generate Instagram Content</span>
              </button>
            </div>

            {/* YouTube Generator */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all group">
              <div className="text-center mb-8">
                <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Youtube className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">YouTube</h3>
                <p className="text-slate-300">
                  Generate titles, descriptions, and thumbnails
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>SEO-optimized titles</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Engaging descriptions</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Thumbnail concepts</span>
                </div>
              </div>

              <button
                onClick={() => handleNavigation("instagram")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generate YouTube Content</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Creators
            </h2>
            <p className="text-xl text-slate-300">
              Join thousands of content creators who've transformed their social
              media presence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-300 mb-4">
                "ContentGen transformed my Instagram game. My engagement went up
                400% in just one month!"
              </p>
              <p className="text-white font-semibold">
                - Sarah Chen, Lifestyle Blogger
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-300 mb-4">
                "The YouTube title generator is incredible. My videos are
                getting more views than ever!"
              </p>
              <p className="text-white font-semibold">
                - Marcus Rodriguez, Tech YouTuber
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-slate-300 mb-4">
                "This tool saves me hours every week. The content quality is
                consistently amazing."
              </p>
              <p className="text-white font-semibold">
                - Emma Thompson, Digital Marketer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Go Viral?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using ContentGen to
            create engaging, high-performing social media content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Creating Now</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default Homes;
