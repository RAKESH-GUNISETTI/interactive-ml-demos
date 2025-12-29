import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { SampleInputButton } from '@/components/shared/SampleInputButton';
import { ModelLoadingProgress } from '@/components/ui/model-loading-progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Sparkles, ShieldCheck, ShieldX } from 'lucide-react';
import { detectSpam } from '@/lib/ml-service';
import { toast } from 'sonner';

const exampleMessages = [
  "Congratulations! You've won a $1000 gift card. Click here to claim now!",
  "Hey, are we still meeting for lunch tomorrow at 12?",
  "URGENT: Your account has been compromised. Click link to verify NOW!!!",
  "Thanks for your help with the project yesterday!",
  "FREE iPhone 15! Limited time offer - ACT NOW before it's gone!!!",
  "Can you send me the meeting notes from yesterday's call?",
];

interface SpamResult {
  label: 'Spam' | 'Not Spam';
  confidence: number;
}

export default function SpamClassification() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<SpamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const handlePredict = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setIsModelLoading(true);
    setResult(null);
    setModelProgress(0);

    try {
      const response = await detectSpam(message, (progress) => {
        setModelProgress(progress);
      });

      setIsModelLoading(false);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Classification complete!', {
          description: `Message classified as ${response.data.label}`,
        });
      } else {
        toast.error('Classification failed', {
          description: response.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error('Error during classification');
      setIsModelLoading(false);
    }

    setIsLoading(false);
  };

  const handleSampleInput = () => {
    const randomExample = exampleMessages[Math.floor(Math.random() * exampleMessages.length)];
    setMessage(randomExample);
    setResult(null);
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="Spam Message Classification"
        description="AI-powered spam detection using browser-based machine learning. No data leaves your device."
        category="nlp"
        categoryLabel="Natural Language Processing"
        icon={MessageSquare}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <HowItWorks
              modelName="DistilBERT + Heuristics"
              description="This model combines transformer-based sentiment analysis with rule-based spam detection. It analyzes language patterns, suspicious keywords, and text formatting to identify spam."
              keyFactors={[
                'Urgent/promotional language',
                'Presence of suspicious keywords',
                'Excessive capitalization',
                'Money/prize-related phrases',
                'Sentiment analysis score',
              ]}
              technicalDetails="Model: Browser-based inference | Framework: Transformers.js | Privacy: 100% client-side"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-glass border-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Input Message
                      </CardTitle>
                      <CardDescription>Enter any text message to check if it's spam</CardDescription>
                    </div>
                    <SampleInputButton onClick={handleSampleInput} label="Random Sample" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message Text</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length} characters • {message.split(/\s+/).filter(Boolean).length} words
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handlePredict} 
                      disabled={!message.trim() || isLoading} 
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isLoading ? 'Analyzing...' : 'Classify Message'}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {isModelLoading && (
              <ModelLoadingProgress
                progress={modelProgress}
                modelName="distilbert-base-uncased-sst-2"
              />
            )}

            {isLoading && !isModelLoading && (
              <ResultDisplay title="Prediction Result" result="" isLoading={true} />
            )}

            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ResultDisplay
                  title="Prediction Result"
                  result={result.label}
                  confidence={result.confidence}
                  isPositive={result.label === 'Not Spam'}
                  icon={result.label === 'Not Spam' ? ShieldCheck : ShieldX}
                  additionalInfo={
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {result.label === 'Spam'
                          ? 'This message contains characteristics commonly found in spam: promotional language, urgency, or suspicious patterns.'
                          : 'This message appears to be legitimate communication without spam indicators.'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Browser-based AI
                        </span>
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent">
                          Privacy-first
                        </span>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            )}

            {!result && !isLoading && (
              <Card className="bg-muted/30 border-dashed border-2 border-border h-full min-h-[300px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 blur-3xl opacity-20 gradient-primary rounded-full" />
                    <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4 relative" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    Enter a message and click "Classify" to see results
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    AI model runs entirely in your browser
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ProjectPageLayout>
    </Layout>
  );
}