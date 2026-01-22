import { useState } from 'react';
import './InfoTooltip.css';

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="info-tooltip-wrapper">
      <button
        className="info-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
        type="button"
      >
        ?
      </button>
      {isVisible && (
        <div className="info-tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
}
