
import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="text-lg font-bold bg-black/30 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm shadow-neon-cyan">
      <span className="text-neon-cyan text-glow-cyan">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

export default DigitalClock;
