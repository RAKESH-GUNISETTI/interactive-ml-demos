import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ModelLoadingProgressProps {
  progress: number;
  modelName: string;
  isComplete?: boolean;
  className?: string;
}

const loadingStages = [
  { threshold: 0, message: 'Initializing model...', icon: Brain },
  { threshold: 20, message: 'Downloading weights...', icon: Download },
  { threshold: 60, message: 'Loading into memory...', icon: Brain },
  { threshold: 85, message: 'Preparing inference...', icon: Sparkles },
  { threshold: 100, message: 'Model ready!', icon: CheckCircle2 },
];

export function ModelLoadingProgress({
  progress,
  modelName,
  isComplete = false,
  className,
}: ModelLoadingProgressProps) {
  const currentStage = loadingStages.reduce((acc, stage) => {
    if (progress >= stage.threshold) return stage;
    return acc;
  }, loadingStages[0]);

  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn("w-full", className)}
        >
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            {/* Animated top border */}
            <motion.div
              className="h-1 gradient-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />

            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={{ rotate: isComplete ? 0 : 360 }}
                  transition={{
                    duration: 2,
                    repeat: isComplete ? 0 : Infinity,
                    ease: 'linear',
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  {/* Orbiting dot */}
                  {!isComplete && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    Loading AI Model
                  </h3>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {modelName}
                  </p>
                </div>

                <motion.div
                  key={progress}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gradient"
                >
                  {Math.round(progress)}%
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>

                {/* Stage indicator */}
                <motion.div
                  key={currentStage.message}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <StageIcon className="h-4 w-4 text-primary" />
                  <span>{currentStage.message}</span>
                </motion.div>
              </div>

              {/* Stage progress dots */}
              <div className="flex justify-between px-2">
                {loadingStages.slice(0, -1).map((stage, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: progress >= stage.threshold ? 1 : 0.5,
                      opacity: progress >= stage.threshold ? 1 : 0.3,
                    }}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                      progress >= stage.threshold
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>

              {/* Info text */}
              <p className="text-xs text-center text-muted-foreground/70">
                First-time loading may take longer. Model will be cached for faster future use.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}