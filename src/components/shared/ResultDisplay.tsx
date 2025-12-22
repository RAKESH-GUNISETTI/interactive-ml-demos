import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultDisplayProps {
  title: string;
  result: string;
  confidence?: number;
  isPositive?: boolean;
  isLoading?: boolean;
  additionalInfo?: React.ReactNode;
}

export function ResultDisplay({
  title,
  result,
  confidence,
  isPositive = true,
  isLoading = false,
  additionalInfo,
}: ResultDisplayProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Processing your request...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden animate-fade-in">
      <div className={cn(
        "h-1",
        isPositive ? "bg-success" : "bg-destructive"
      )} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {isPositive ? (
            <CheckCircle2 className="h-8 w-8 text-success" />
          ) : (
            <XCircle className="h-8 w-8 text-destructive" />
          )}
          <span className="text-2xl font-semibold text-foreground">{result}</span>
        </div>
        
        {confidence !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium text-foreground">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isPositive ? "bg-success" : "bg-destructive"
                )}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}

        {additionalInfo && (
          <div className="pt-4 border-t border-border">
            {additionalInfo}
          </div>
        )}
      </CardContent>
    </Card>
  );
}