import { FileVideo, Sparkles } from "lucide-react";

const Youtube = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div className="space-y-6">
            {/* Video Upload Section */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <FileVideo className="w-5 h-5 mr-2 text-red-400" />
                <h2 className="text-lg font-semibold">Video Upload</h2>
              </div>

              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                <label className="bg-blue-500 w-40 mx-auto rounded-4xl flex justify-center items-center pl-10 text-2xl font-semibold">
                  Image
                  <input
                    type="file"
                    className="opacity-0 w-12 h-12 mx-auto mb-4 text-slate-400"
                  />
                </label>

                <p className="text-lg font-medium mb-2">Drop your image here</p>
                <p className="text-sm text-slate-400 mb-4">
                  or click to browse
                </p>
              </div>
            </div>

            {/* Content Description */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center mb-4">
                <span className="text-red-400 font-mono mr-2 text-lg font-bold">
                  T
                </span>
                <h2 className="text-lg font-semibold">Content Description</h2>
              </div>

              <textarea
                placeholder="Describe your video content, target audience, and desired style..."
                className="w-full h-32 bg-slate-700 rounded-xl p-4 text-white placeholder-slate-400 border border-slate-600 resize-none"
                readOnly
              />
            </div>

            {/* Generate Button */}
            <button className="w-full py-4 rounded-xl font-semibold text-lg bg-slate-700 text-slate-400 cursor-not-allowed flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate YouTube Thumbnail</span>
            </button>
          </div>

          {/* Right Column - Generated Content Preview */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center mb-6">
              {/* <Youtube className="w-5 h-5 mr-2 text-red-500" /> */}
              <h2 className="text-lg font-semibold">Generated Content</h2>
            </div>

            <div className="space-y-6">
              {/* Video Preview Placeholder */}
              <div className="aspect-video bg-slate-700 rounded-xl flex items-center justify-center border border-slate-600">
                <div className="text-center">
                  {/* <Youtube className="w-16 h-16 text-slate-500 mx-auto mb-3" /> */}
                  <p className="text-slate-400 text-sm">
                    image preview will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Youtube;
