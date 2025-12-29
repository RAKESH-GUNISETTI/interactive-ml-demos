import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCounterProps {
  value: string | number;
  className?: string;
  duration?: number;
  decimals?: number;
  suffix?: string;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({ 
  value, 
  className = '', 
  duration = 2,
  decimals = 0,
  suffix: customSuffix,
  formatter
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === 'number' ? 0 : '');
  
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  const extractedSuffix = typeof value === 'string' ? value.replace(/[\d.-]/g, '') : '';
  const finalSuffix = customSuffix !== undefined ? customSuffix : extractedSuffix;
  const isNumeric = !isNaN(numericValue);

  useEffect(() => {
    if (isInView && isNumeric) {
      let start = 0;
      const end = numericValue;
      const increment = end / (duration * 60);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          if (formatter) {
            setDisplayValue(formatter(end));
          } else {
            setDisplayValue(decimals > 0 ? end.toFixed(decimals) : Math.floor(end));
          }
          clearInterval(timer);
        } else {
          if (formatter) {
            setDisplayValue(formatter(start));
          } else {
            setDisplayValue(decimals > 0 ? start.toFixed(decimals) : Math.floor(start));
          }
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    } else if (isInView) {
      setDisplayValue(value);
    }
  }, [isInView, numericValue, duration, isNumeric, value, decimals, formatter]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {displayValue}{finalSuffix}
    </motion.span>
  );
}
