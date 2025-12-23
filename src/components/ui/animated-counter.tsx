import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCounterProps {
  value: string | number;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : '');
  
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
  const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '') : '';
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (isInView && isNumeric) {
      let start = 0;
      const end = numericValue;
      const increment = end / (duration * 60);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    } else if (isInView) {
      setDisplayValue(value);
    }
  }, [isInView, numericValue, duration, isNumeric, value]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {displayValue}{suffix}
    </motion.span>
  );
}
