export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          About GenAI Image Generator
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Learn about our project, technology stack, and ethical AI principles
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
          </div>
          <div className="card-content">
            <p className="text-gray-600 mb-4">
              GenAI Image Generator is a cutting-edge platform that leverages AWS Bedrock's 
              advanced diffusion models to create stunning images from text prompts.
            </p>
            <p className="text-gray-600">
              Built for the GenAI Hackathon by Impetus & AWS, this project demonstrates 
              the power of generative AI while maintaining ethical standards and responsible practices.
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Technology Stack</h2>
          </div>
          <div className="card-content">
            <ul className="space-y-2 text-gray-600">
              <li>• Backend: Express.js with Node.js</li>
              <li>• Frontend: React with TypeScript</li>
              <li>• AI Models: AWS Bedrock (Stable Diffusion XL, Titan)</li>
              <li>• Storage: Amazon S3</li>
              <li>• Deployment: AWS Lambda, API Gateway</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}