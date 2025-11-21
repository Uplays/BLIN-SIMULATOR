import React from 'react';
import { useOS } from '../contexts/OSContext';

const Desktop: React.FC = () => {
  const { desktopBackground } = useOS();

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url('${desktopBackground}')` }}
      aria-label="Desktop background"
    >
      {/* Any desktop icons or widgets can go here */}
    </div>
  );
};

export default Desktop;