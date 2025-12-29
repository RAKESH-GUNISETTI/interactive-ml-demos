import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, TrendingUp, Loader2, Sparkles, LucideIcon } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  title: string;
  result: string;
  confidence?: number;
  isPositive?: boolean;
  isLoading?: boolean;
  additionalInfo?: React.ReactNode;
  icon?: LucideIcon;
}

const loadingMessages = [
  'Loading model...',
  'Processing input...',
  'Running inference...',
  'Analyzing data...',
  'Generating prediction...',
];

export function ResultDisplay({
  title,
  result,
  confidence,
  isPositive = true,
  isLoading = false,
  additionalInfo,
  icon: Icon,
}: ResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-muted" />
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
            </div>
          </motion.div>
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-muted-foreground font-medium"
          >
            Running model inference...
          </motion.p>
          <motion.div
            className="flex gap-1 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        <Card className="bg-card border-border overflow-hidden relative">
          {/* Animated top bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "h-1.5 origin-left",
              isPositive ? "bg-gradient-to-r from-success to-success/60" : "bg-gradient-to-r from-destructive to-destructive/60"
            )}
          />
          
          {/* Success/Error glow effect */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-32 opacity-20 blur-3xl pointer-events-none",
            isPositive ? "bg-success" : "bg-destructive"
          )} />

          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <TrendingUp className="h-5 w-5 text-primary" />
              </motion.div>
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 relative">
            {/* Main Result */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
              >
                {Icon ? (
                  <div className={cn("p-3 rounded-full", isPositive ? "bg-success/10 glow-success" : "bg-destructive/10")}>
                    <Icon className={cn("h-8 w-8", isPositive ? "text-success" : "text-destructive")} />
                  </div>
                ) : isPositive ? (
                  <div className="p-3 rounded-full bg-success/10 glow-success">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-destructive/10">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground"
              >
                {result}
              </motion.span>
            </div>
            
            {/* Confidence Display */}
            {confidence !== undefined && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model Confidence</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="font-semibold text-foreground"
                    >
                      {(confidence * 100).toFixed(1)}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                      className={cn(
                        "h-full rounded-full",
                        isPositive
                          ? "bg-gradient-to-r from-success to-success/70"
                          : "bg-gradient-to-r from-destructive to-destructive/70"
                      )}
                    />
                  </div>
                </div>
                <div className="ml-6 hidden sm:block">
                  <CircularProgress
                    value={confidence * 100}
                    size={80}
                    strokeWidth={6}
                    isPositive={isPositive}
                  />
                </div>
              </motion.div>
            )}

            {/* Additional Info */}
            {additionalInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-border"
              >
                {additionalInfo}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
