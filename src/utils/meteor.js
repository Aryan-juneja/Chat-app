'use client';

import React, { useEffect, useState } from "react";

function generateMeteorStyles(number) {
  return Array.from({ length: number }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${Math.random() * 2}s`,
  }));
}

function Meteors({ number }) {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = generateMeteorStyles(number);
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {meteorStyles.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-fall"
          style={style}
        />
      ))}
    </div>
  );
}

export default Meteors;
