import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-surface to-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="text-8xl sm:text-9xl font-bold text-primary mb-4">
              404
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-muted mb-8 leading-relaxed"
          >
            Oops! The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best developers sometimes lose their way.
          </motion.p>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            <Link to="/">
              <Button className="w-full">
                <Home size={20} className="mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-card rounded-2xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-text mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                to="/services"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface transition-colors group"
              >
                <Search size={16} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm text-text group-hover:text-primary transition-colors">
                  Services
                </span>
              </Link>
              
              <Link
                to="/projects"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface transition-colors group"
              >
                <Search size={16} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm text-text group-hover:text-primary transition-colors">
                  Projects
                </span>
              </Link>
              
              <Link
                to="/about"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface transition-colors group"
              >
                <Search size={16} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm text-text group-hover:text-primary transition-colors">
                  About
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface transition-colors group"
              >
                <Mail size={16} className="text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm text-text group-hover:text-primary transition-colors">
                  Contact
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <p className="text-muted text-sm mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/consultation"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Mail size={16} className="mr-2" />
                Start a Project
              </Link>
              
              <a
                href="mailto:havocsolutions1@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
              >
                <Mail size={16} className="mr-2" />
                Contact Support
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
