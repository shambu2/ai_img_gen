import { Hash, Instagram, Sparkles } from "lucide-react";

const InstagramHero = () => {
  const categories = [
    "Motivational",
    "Lifestyle",
    "Business",
    "Travel",
    "Food",
    "Fashion",
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* File Input Sections */}
            <div className="border p-6 rounded-2xl bg-slate-800">
              <p className="pb-3 text-xl font-semibold">Upload your image</p>
              <div className="flex  bg-slate-700 min-h-40 justify-center items-center border rounded-2xl pl-20 border-slate-600 gap-4">
                <input
                  type="file"
                  name="primary image"
                  id=""
                  className=""
                />
              </div>
            </div>
            <div className="border p-6 rounded-2xl bg-slate-800">
              <p className="pb-3 text-xl font-semibold">Upload reference image</p>
              <div className="flex  bg-slate-700 min-h-40 justify-center items-center border rounded-2xl pl-20 border-slate-600 gap-4">
                <input
                  type="file"
                  name="secondary image"
                  id=""
                  className=""
                />
              </div>
            </div>
            {/* <div>
              <p>Upload reference image</p>
              <div className="flex min-h-40 justify-center items-center border rounded-2xl pl-20 border-slate-600 gap-4">
                <input
                  type="file"
                  name="secondary image"
                  id=""
                  className="grid-rows-2"
                />
              </div>
            </div> */}

            {/* Prompt Section */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <span className="text-blue-400 font-mono mr-2 text-lg font-bold">
                  T
                </span>
                <h2 className="text-lg font-semibold">Prompt</h2>
              </div>

              <textarea
                placeholder="Describe what kind of Instagram content you want to create..."
                className="w-full h-32 bg-slate-700 rounded-xl p-4 text-white placeholder-slate-400 border border-slate-600 resize-none"
                readOnly
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Input Section */}
            {/* <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <Hash className="w-5 h-5 mr-2 text-blue-400" />
                <h2 className="text-lg font-semibold">Additional Input</h2>
              </div>
              
              <textarea
                placeholder="Add keywords, hashtags, or specific requirements..."
                className="w-full h-24 bg-slate-700 rounded-xl p-4 text-white placeholder-slate-400 border border-slate-600 resize-none"
                readOnly
              />
            </div> */}

            {/* Generate Button */}
            <button className="w-full py-4 rounded-xl font-semibold text-lg bg-slate-700 text-slate-400 cursor-not-allowed flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate Instagram Content</span>
            </button>
          </div>

          {/* Right Column - Generated Content */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center mb-6">
              <Instagram className="w-5 h-5 mr-2 text-pink-400" />
              <h2 className="text-lg font-semibold">Generated Content</h2>
            </div>

            <div className="h-full min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Ready to create content
                </h3>
                <p className="text-slate-400 max-w-sm">
                  Upload at least one image and enter a prompt to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InstagramHero;
