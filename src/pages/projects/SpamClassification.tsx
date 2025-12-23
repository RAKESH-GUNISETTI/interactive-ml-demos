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
import { MessageSquare, Sparkles } from 'lucide-react';
import { predictSpam, SpamPrediction } from '@/lib/api';

const exampleMessages = [
  "Congratulations! You've won a $1000 gift card. Click here to claim now!",
  "Hey, are we still meeting for lunch tomorrow at 12?",
  "URGENT: Your account has been compromised. Click link to verify.",
  "Thanks for your help with the project yesterday!",
];

export default function SpamClassification() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<SpamPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setResult(null);

    const response = await predictSpam(message);
    if (response.success && response.data) {
      setResult(response.data);
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
        description="Enter a text message to classify it as spam or legitimate using NLP and TF-IDF vectorization."
        category="nlp"
        categoryLabel="Natural Language Processing"
        icon={MessageSquare}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <HowItWorks
              modelName="Naive Bayes / Logistic Regression"
              description="This model uses TF-IDF (Term Frequency-Inverse Document Frequency) to convert text into numerical features, then classifies messages based on learned patterns from thousands of labeled examples."
              keyFactors={[
                'Urgent/promotional language',
                'Presence of suspicious links',
                'Excessive capitalization',
                'Money/prize-related words',
              ]}
              technicalDetails="Preprocessing: Tokenization → Stopword removal → TF-IDF → Classification"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display text-xl">Input Message</CardTitle>
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
                      className="resize-none transition-all focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handlePredict} disabled={!message.trim() || isLoading} className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Classify Message
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Result Section */}
          <div>
            {isLoading && <ResultDisplay title="Prediction Result" result="" isLoading={true} />}
            {result && !isLoading && (
              <ResultDisplay
                title="Prediction Result"
                result={result.label}
                confidence={result.confidence}
                isPositive={result.label === 'Not Spam'}
                additionalInfo={
                  <p className="text-sm text-muted-foreground">
                    {result.label === 'Spam'
                      ? 'This message has characteristics commonly found in spam messages.'
                      : 'This message appears to be legitimate.'}
                  </p>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Enter a message and click "Classify" to see results</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ProjectPageLayout>
    </Layout>
  );
}
