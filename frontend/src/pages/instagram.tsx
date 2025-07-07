import { Sparkles } from "lucide-react";

import Footer from "../components/Footer";

const instagram = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className=" ">
        <div className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">ContentGen</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href=""
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="/youtube"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Youtube
              </a>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                stroke-width="1.7142857142857142"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-circle-user-icon lucide-circle-user"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="text-white min-h-screen">
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
        <div>a</div>
      </div>

      <Footer />
    </div>
  );
};

export default instagram;
