import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HowItWorksProps {
  modelName: string;
  description: string;
  keyFactors: string[];
  technicalDetails?: string;
}

export function HowItWorks({
  modelName,
  description,
  keyFactors,
  technicalDetails,
}: HowItWorksProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <span className="font-medium text-foreground">How this model works</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              {/* Model Overview */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  Model: {modelName}
                </h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              {/* Key Factors */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Key Factors Influencing Predictions
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keyFactors.map((factor, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {factor}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Technical Details (Optional) */}
              {technicalDetails && (
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground font-mono">
                  {technicalDetails}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
