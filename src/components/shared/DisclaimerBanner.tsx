import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DisclaimerBanner() {
  return (
    <Alert className="bg-warning/10 border-warning/30">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertDescription className="text-sm text-foreground/80">
        <strong>Educational Purpose Only:</strong> This application is built for 
        educational and demonstration purposes only. Predictions are not intended 
        for real-world decision making.
      </AlertDescription>
    </Alert>
  );
}