import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  // `className` and `style` are already covered by extending `React.HTMLAttributes<HTMLDivElement>`
  // `onDragOver`, `onDrop`, `onDragLeave` are also covered.
}

// Refactor to use React.forwardRef to allow the Window component to attach a ref
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref} // Attach the forwarded ref to the div element
      className={`
        bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20
        transition-all duration-300 ease-in-out
        ${className}
      `}
      {...props} // Spread additional HTML attributes
    >
      {children}
    </div>
  );
});

export default GlassCard;