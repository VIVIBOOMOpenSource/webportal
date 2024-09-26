import React, { useState, useEffect } from 'react';

import './progress-bar.scss';

const INTERVAL = 100;

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress((Math.round(100 - progress) / 25) + progress), INTERVAL);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default ProgressBar;
