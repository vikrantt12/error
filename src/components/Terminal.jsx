
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Terminal() {
  const [commands, setCommands] = useState([]);
  const [input, setInput] = useState('');

  const handleCommand = (e) => {
    e.preventDefault();
    const newCommands = [...commands, { type: 'input', text: input }];
    
    // Easter egg
    if (input.toLowerCase() === 'hack the matrix') {
      newCommands.push({ 
        type: 'output', 
        text: 'ACCESS GRANTED. WELCOME TO THE UNDERGROUND.' 
      });
    } else {
      newCommands.push({ 
        type: 'output', 
        text: 'Command not recognized. Nice try.' 
      });
    }
    
    setCommands(newCommands);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 border border-green-500 bg-black font-mono"
    >
      {commands.map((cmd, i) => (
        <div key={i} className={cmd.type === 'input' ? 'text-green-500' : 'text-red-500'}>
          {cmd.type === 'input' ? '> ' : '$ '}{cmd.text}
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex">
        <span className="text-green-500">{'> '}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-500 outline-none"
          autoFocus
        />
      </form>
    </motion.div>
  );
}
