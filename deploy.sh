#!/bin/bash

# Havoc Solutions Deployment Script
echo "🚀 Starting Havoc Solutions Deployment..."

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

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the root Havoc directory"
    exit 1
fi

print_status "Checking directory structure..."
echo "📁 Current structure:"
echo "├── frontend/ (frontend)"
echo "├── backend/ (backend)"
echo "└── vercel.json (deployment config)"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Please login to Vercel first:"
    echo "Run: vercel login"
    exit 1
fi

print_status "Installing frontend dependencies..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

print_status "Building frontend..."
if npm run build; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

print_status "Deploying to Vercel..."
if vercel --prod; then
    print_success "Frontend deployed to Vercel!"
    echo ""
    echo "🎉 Deployment Complete!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy backend to Render/Heroku"
    echo "2. Set up Supabase database"
    echo "3. Update environment variables"
    echo "4. Test your website"
    echo ""
    echo "Your frontend is now live on Vercel! 🚀"
else
    print_error "Vercel deployment failed"
    exit 1
fi
