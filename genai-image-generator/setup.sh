#!/bin/bash

# 🎨 GenAI Image Generator - Setup Script
# This script automates the setup of the GenAI Image Generator project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js version $(node --version) is compatible"
            return 0
        else
            print_error "Node.js version $(node --version) is too old. Please install Node.js 18+"
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+"
        return 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        print_success "npm version $(npm --version) is available"
        return 0
    else
        print_error "npm is not installed"
        return 1
    fi
}

# Function to check Docker
check_docker() {
    if command_exists docker; then
        print_success "Docker is available"
        return 0
    else
        print_warning "Docker is not installed. You can still run the project locally without Docker"
        return 1
    fi
}

# Function to check AWS CLI
check_aws_cli() {
    if command_exists aws; then
        print_success "AWS CLI is available"
        return 0
    else
        print_warning "AWS CLI is not installed. You'll need to configure AWS credentials manually"
        return 1
    fi
}

# Function to setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from template"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend/.env from template"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Function to install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd backend
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
    print_success "Backend dependencies installed"
}

# Function to install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    cd frontend
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
    print_success "Frontend dependencies installed"
}

# Function to create uploads directory
create_uploads_dir() {
    print_status "Creating uploads directory..."
    mkdir -p backend/uploads
    print_success "Uploads directory created"
}

# Function to setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Create .git/hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Check for .env files
if git diff --cached --name-only | grep -q "\.env$"; then
    echo "Warning: .env files detected in commit. Make sure no secrets are included."
fi

# Run linting
cd backend && npm run lint
cd ../frontend && npm run lint

echo "Pre-commit checks completed."
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks configured"
}

# Function to display setup instructions
display_instructions() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Configure AWS credentials:"
    echo "   - Edit backend/.env with your AWS credentials"
    echo "   - Set up AWS Bedrock access"
    echo "   - Create S3 bucket for image storage"
    echo ""
    echo "2. Start the development servers:"
    echo "   Backend:  cd backend && npm run dev"
    echo "   Frontend: cd frontend && npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo "   Health:   http://localhost:3001/health"
    echo ""
    echo "4. Test the API:"
    echo "   curl -X GET http://localhost:3001/health"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md: Complete project documentation"
    echo "   - docs/API.md: API documentation"
    echo "   - docs/ARCHITECTURE.md: System architecture"
    echo ""
    echo "🐳 Docker (optional):"
    echo "   docker-compose up --build"
    echo ""
    echo "🧪 Testing:"
    echo "   Backend:  cd backend && npm test"
    echo "   Frontend: cd frontend && npm test"
    echo ""
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check if backend can start
    cd backend
    timeout 10s npm start > /dev/null 2>&1 &
    BACKEND_PID=$!
    sleep 2
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend health check passed"
        kill $BACKEND_PID 2>/dev/null || true
    else
        print_warning "Backend health check failed"
    fi
    
    cd ..
}

# Main setup function
main() {
    echo "🎨 GenAI Image Generator - Setup Script"
    echo "======================================"
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! check_node_version; then
        print_error "Please install Node.js 18+ and try again"
        exit 1
    fi
    
    if ! check_npm_version; then
        print_error "Please install npm and try again"
        exit 1
    fi
    
    check_docker
    check_aws_cli
    
    echo ""
    
    # Setup environment files
    setup_environment
    
    # Install dependencies
    install_backend
    install_frontend
    
    # Create necessary directories
    create_uploads_dir
    
    # Setup Git hooks
    setup_git_hooks
    
    # Run health checks
    run_health_checks
    
    # Display instructions
    display_instructions
}

# Run main function
main "$@"