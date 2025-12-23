import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 40px -12px hsl(var(--primary) / 0.15)',
      }}
      className={cn(
        'rounded-xl border border-border bg-card transition-colors duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
