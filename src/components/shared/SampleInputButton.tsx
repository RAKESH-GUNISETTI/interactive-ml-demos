import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SampleInputButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function SampleInputButton({
  onClick,
  label = 'Try Sample Input',
  className,
}: SampleInputButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        className={cn(
          'border-dashed border-2 hover:border-solid hover:border-accent hover:bg-accent/5',
          className
        )}
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </motion.div>
  );
}
