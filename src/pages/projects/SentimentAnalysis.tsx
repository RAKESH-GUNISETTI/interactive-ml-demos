import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { SampleInputButton } from '@/components/shared/SampleInputButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { predictSentiment, SentimentPrediction } from '@/lib/api';

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
];

export default function SentimentAnalysis() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState<SentimentPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!review.trim()) return;
    setIsLoading(true);
    setResult(null);

    const response = await predictSentiment(review);
    if (response.success && response.data) {
      setResult(response.data);
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
        description="Analyze the sentiment of movie reviews using advanced NLP. Enter a review to determine if it expresses positive or negative sentiment."
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
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl">Movie Review</CardTitle>
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
                    className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    {review.length} characters • {review.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
                
                <Button
                  onClick={handlePredict}
                  disabled={!review.trim() || isLoading}
                  className="w-full group"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Analyze Sentiment
                </Button>
              </CardContent>
            </Card>

            {/* Sample Inputs */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Try Sample Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
              modelName="LSTM / Transformer-based NLP"
              description="This model uses deep learning to understand the contextual meaning of words in a review. It analyzes word patterns, phrases, and overall tone to classify sentiment as positive or negative."
              keyFactors={[
                'Word choice and vocabulary',
                'Sentence structure and context',
                'Emotional indicators',
                'Negation handling',
                'Intensifiers and modifiers',
                'Overall tone consistency',
              ]}
              technicalDetails="Architecture: LSTM/Transformer | Dataset: IMDB 50K Reviews | Accuracy: ~88%"
            />
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading && (
              <ResultDisplay
                title="Analyzing Sentiment..."
                result=""
                isLoading={true}
              />
            )}
            {result && !isLoading && (
              <ResultDisplay
                title="Sentiment Analysis Result"
                result={`${result.sentiment} Sentiment`}
                confidence={result.confidence}
                isPositive={result.sentiment === 'Positive'}
                icon={result.sentiment === 'Positive' ? ThumbsUp : ThumbsDown}
                additionalInfo={
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {result.sentiment === 'Positive'
                        ? 'The review contains positive language, expressing satisfaction, enjoyment, or praise for the movie.'
                        : 'The review contains negative language, expressing disappointment, criticism, or displeasure with the movie.'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">NLP Analysis</span>
                      <span className="px-2 py-1 bg-muted rounded">Context-Aware</span>
                    </div>
                  </div>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/30 border-dashed border-2 border-border h-full min-h-[300px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Film className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    Enter a review to analyze
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Results will appear here after analysis
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
