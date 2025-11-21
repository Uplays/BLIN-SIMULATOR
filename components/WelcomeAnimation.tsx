import React, { useEffect, useState } from 'react';

interface WelcomeAnimationProps {
  onAnimationComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay to ensure render before animation

    // Stay for a bit, then fade out
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Visible for 1.9s (2000 - 100)

    // Animation complete after fade out
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3000); // Total animation time

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center
                  bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900
                  text-white text-5xl font-extrabold transition-opacity duration-1000 ease-in-out
                  ${isVisible ? 'opacity-100' : 'opacity-0'} z-[9999]`} // High z-index to cover everything
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="drop-shadow-lg tracking-wider">
        BIENVENIDO A {' '}
        <span className="bg-gradient-to-r from-[#00b0ff] to-[#00e081] text-transparent bg-clip-text">
          BLIN
        </span>
      </span>
    </div>
  );
};

export default WelcomeAnimation;