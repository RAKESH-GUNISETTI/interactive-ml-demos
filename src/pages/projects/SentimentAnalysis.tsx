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
import { Film, Sparkles, ThumbsUp, ThumbsDown, Heart, HeartCrack } from 'lucide-react';
import { analyzeSentiment } from '@/lib/ml-service';
import { toast } from 'sonner';

const sampleReviews = [
  {
    label: 'Positive Review',
    value: "This movie was absolutely amazing! The acting was superb and the plot kept me on the edge of my seat throughout. A masterpiece of modern cinema!"
  },
  {
    label: 'Negative Review',
    value: "Terrible waste of time. Poor acting, predictable plot, and the ending was so disappointing. Would not recommend to anyone."
  },
  {
    label: 'Mixed Review',
    value: "The visuals were stunning but the story felt rushed. Some great performances overshadowed by weak writing."
  },
  {
    label: 'Enthusiastic Positive',
    value: "Best movie I've seen in years! The director outdid themselves. Every scene was perfect, the soundtrack was incredible, and I was emotionally moved throughout."
  },
];

interface SentimentResult {
  sentiment: 'Positive' | 'Negative';
  confidence: number;
}

export default function SentimentAnalysis() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const handlePredict = async () => {
    if (!review.trim()) return;
    setIsLoading(true);
    setIsModelLoading(true);
    setResult(null);
    setModelProgress(0);

    try {
      const response = await analyzeSentiment(review, (progress) => {
        setModelProgress(progress);
      });

      setIsModelLoading(false);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Analysis complete!', {
          description: `Detected ${response.data.sentiment} sentiment`,
        });
      } else {
        toast.error('Analysis failed', {
          description: response.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error('Error during analysis');
      setIsModelLoading(false);
    }

    setIsLoading(false);
  };

  const handleSampleSelect = (value: string) => {
    setReview(value);
    setResult(null);
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="IMDB Sentiment Analysis"
        description="Analyze movie review sentiment using state-of-the-art transformer models running entirely in your browser."
        category="nlp"
        categoryLabel="Natural Language Processing"
        icon={Film}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-glass border-primary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  Movie Review
                </CardTitle>
                <CardDescription>
                  Enter a movie review to analyze its emotional tone and sentiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="review">Review Text</Label>
                  <Textarea
                    id="review"
                    placeholder="Type or paste a movie review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={8}
                    className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    {review.length} characters • {review.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handlePredict}
                    disabled={!review.trim() || isLoading}
                    className="w-full gradient-primary hover:opacity-90 transition-opacity group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Sample Inputs */}
            <Card className="card-glass border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Try Sample Reviews</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {sampleReviews.map((sample, idx) => (
                  <SampleInputButton
                    key={idx}
                    label={sample.label}
                    onClick={() => handleSampleSelect(sample.value)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* How It Works */}
            <HowItWorks
              modelName="DistilBERT Transformer"
              description="This model uses a pre-trained DistilBERT transformer fine-tuned on the SST-2 sentiment dataset. It understands contextual meaning and nuances in text."
              keyFactors={[
                'Word choice and vocabulary',
                'Sentence structure and context',
                'Emotional indicators',
                'Negation handling',
                'Intensifiers and modifiers',
              ]}
              technicalDetails="Model: DistilBERT-SST2 | Framework: Transformers.js | Accuracy: ~91% on SST-2"
            />
          </motion.div>

          {/* Result Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isModelLoading && (
              <ModelLoadingProgress
                progress={modelProgress}
                modelName="distilbert-base-uncased-sst-2"
              />
            )}

            {isLoading && !isModelLoading && (
              <ResultDisplay
                title="Analyzing Sentiment..."
                result=""
                isLoading={true}
              />
            )}

            {result && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ResultDisplay
                  title="Sentiment Analysis Result"
                  result={`${result.sentiment} Sentiment`}
                  confidence={result.confidence}
                  isPositive={result.sentiment === 'Positive'}
                  icon={result.sentiment === 'Positive' ? Heart : HeartCrack}
                  additionalInfo={
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {result.sentiment === 'Positive'
                          ? 'The review expresses satisfaction, enjoyment, or praise. Positive language patterns detected.'
                          : 'The review expresses disappointment, criticism, or displeasure. Negative language patterns detected.'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Transformer Model
                        </span>
                        <span className="px-2 py-1 rounded-full bg-accent/10 text-accent">
                          Context-Aware
                        </span>
                        <span className="px-2 py-1 rounded-full bg-success/10 text-success">
                          Browser-based
                        </span>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            )}

            {!result && !isLoading && (
              <Card className="bg-muted/30 border-dashed border-2 border-border h-full min-h-[400px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-4"
                  >
                    <div className="absolute inset-0 blur-3xl opacity-20 gradient-primary rounded-full" />
                    <div className="relative flex gap-4">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      >
                        <ThumbsUp className="h-12 w-12 text-success/40" />
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <ThumbsDown className="h-12 w-12 text-destructive/40" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    Enter a review to analyze
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Real AI inference running in your browser
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </ProjectPageLayout>
    </Layout>
  );
}