import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      className={cn(
        'bg-card rounded-2xl border border-border transition-all duration-300',
        paddingClasses[padding],
        hover && 'hover:shadow-lg hover:-translate-y-1 hover:border-primary/50',
        className
      )}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
