
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import Terminal from './components/Terminal';
import ParticleField from './components/ParticleField';
import ChatBot from './components/ChatBot';

export default function App() {
  const [glitchMode, setGlitchMode] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const triggerGlitch = () => {
    setGlitchMode(true);
    setTimeout(() => setGlitchMode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 overflow-hidden">
      <ParticleField />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full p-5 z-50 backdrop-blur-lg"
      >
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-mono"
            whileHover={{ scale: 1.1 }}
          >
            <Typewriter
              options={{
                strings: ['VIKRANT.SYS', 'DIGITAL_UNDERGROUND'],
                autoStart: true,
                loop: true,
              }}
            />
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={triggerGlitch}
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-all"
          >
            INITIALIZE_GLITCH()
          </motion.button>
        </div>
      </motion.nav>

      <main className="container mx-auto pt-32 px-4">
        <AnimatePresence>
          {glitchMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-green-500 mix-blend-overlay"
            />
          )}
        </AnimatePresence>

        <Terminal />
        <ChatBot />
        
        <div className="mt-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border border-green-500 backdrop-blur-lg"
          >
            <h2 className="text-xl font-mono mb-4">> SYSTEM.INFO</h2>
            <p className="font-mono">AGENT: Vikrant</p>
            <p className="font-mono">STATUS: Questioning Everything</p>
            <p className="font-mono">MISSION: Figuring Things Out</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
