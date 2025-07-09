export default function Generator() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Generate Images with AI
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Transform your ideas into stunning artwork using advanced AI models
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Generation Settings</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-600 mb-4">
              Configure your image generation parameters and start creating amazing artwork.
            </p>
            {/* Form will be implemented here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Describe the image you want to generate..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select className="input">
                    <option>Stable Diffusion XL</option>
                    <option>Titan Image Generator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select className="input">
                    <option>1024x1024</option>
                    <option>1152x896</option>
                    <option>896x1152</option>
                  </select>
                </div>
              </div>
              
              <button className="btn btn-primary w-full">
                Generate Image
              </button>
            </div>
          </div>
        </div>
        
        {/* Generated Image Display */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Generated Image</h2>
          </div>
          <div className="card-content">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Your generated image will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}