import React from 'react';
import { ArrowRight, Code, Zap, Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-amber-400 text-transparent bg-clip-text">
            Elevate Your Vision
          </h1>
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
            Where minimalism meets sophistication. Create something extraordinary 
            with our cutting-edge platform.
          </p>
          <button className="bg-amber-300 hover:bg-amber-400 text-black px-8 py-3 rounded-none font-medium inline-flex items-center group transition-all">
            Begin Journey
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-y border-zinc-900 py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center p-6 hover:bg-zinc-900/30 transition-colors">
              <div className="border border-amber-300/20 p-4 rounded-none inline-block mb-4">
                <Zap className="text-amber-300" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Swift & Seamless</h3>
              <p className="text-zinc-400">
                Performance that exceeds expectations.
              </p>
            </div>
            <div className="text-center p-6 hover:bg-zinc-900/30 transition-colors">
              <div className="border border-amber-300/20 p-4 rounded-none inline-block mb-4">
                <Code className="text-amber-300" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pure Elegance</h3>
              <p className="text-zinc-400">
                Code that reflects your standards.
              </p>
            </div>
            <div className="text-center p-6 hover:bg-zinc-900/30 transition-colors">
              <div className="border border-amber-300/20 p-4 rounded-none inline-block mb-4">
                <Shield className="text-amber-300" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fortified Core</h3>
              <p className="text-zinc-400">
                Security without compromise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-zinc-600">
          © 2025 Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;