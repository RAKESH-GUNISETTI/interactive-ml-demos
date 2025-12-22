import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Sparkles } from 'lucide-react';
import { predictSentiment, SentimentPrediction } from '@/lib/api';

const exampleReviews = [
  "This movie was absolutely amazing! The acting was superb and the plot kept me on the edge of my seat throughout. Highly recommend!",
  "Terrible waste of time. Poor acting, predictable plot, and the ending was so disappointing. Would not recommend to anyone.",
  "A masterpiece of cinema. The director's vision was executed perfectly, and every scene was beautifully crafted.",
  "I couldn't even finish watching it. The dialogue was cringe-worthy and the characters were completely unlikable.",
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

  const handleExampleClick = (example: string) => {
    setReview(example);
    setResult(null);
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="IMDB Sentiment Analysis"
        description="Analyze the sentiment of movie reviews. Enter a review to determine if it expresses positive or negative sentiment using NLP classification."
        category="nlp"
        categoryLabel="Natural Language Processing"
        icon={Film}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Movie Review</CardTitle>
                <CardDescription>
                  Enter a movie review to analyze its sentiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="review">Review Text</Label>
                  <Textarea
                    id="review"
                    placeholder="Enter a movie review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handlePredict}
                  disabled={!review.trim() || isLoading}
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Sentiment
                </Button>
              </CardContent>
            </Card>

            {/* Example Reviews */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Sample Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exampleReviews.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors"
                  >
                    "{example.slice(0, 70)}..."
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div>
            {isLoading && (
              <ResultDisplay
                title="Sentiment Analysis Result"
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
                additionalInfo={
                  <p className="text-sm text-muted-foreground">
                    {result.sentiment === 'Positive'
                      ? 'The review contains positive language, expressing satisfaction, enjoyment, or praise for the movie.'
                      : 'The review contains negative language, expressing disappointment, criticism, or displeasure with the movie.'}
                  </p>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Enter a review and click "Analyze" to see sentiment results
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