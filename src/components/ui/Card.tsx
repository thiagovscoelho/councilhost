import React, { HTMLAttributes } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  const classes = `card ${hover ? 'card-hover' : ''} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
