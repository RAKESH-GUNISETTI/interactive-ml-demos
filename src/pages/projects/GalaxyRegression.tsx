import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Sparkles } from 'lucide-react';
import { predictGalaxy, GalaxyInput, GalaxyPrediction } from '@/lib/api';

const defaultValues: GalaxyInput = {
  ra: 183.531,
  dec: 0.089,
  u: 19.47,
  g: 17.04,
  r: 15.94,
  i: 15.50,
  z: 15.22,
  redshift: 0.634,
};

const fieldDescriptions: Record<keyof GalaxyInput, string> = {
  ra: 'Right Ascension (degrees)',
  dec: 'Declination (degrees)',
  u: 'Ultraviolet magnitude',
  g: 'Green magnitude',
  r: 'Red magnitude',
  i: 'Near Infrared magnitude',
  z: 'Infrared magnitude',
  redshift: 'Redshift value',
};

export default function GalaxyRegression() {
  const [formData, setFormData] = useState<GalaxyInput>(defaultValues);
  const [result, setResult] = useState<GalaxyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof GalaxyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setResult(null);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await predictGalaxy(formData);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="Galaxy Star Regression"
        description="Predict continuous astronomical values for galaxies based on their spectral features including magnitude measurements and redshift."
        category="regression"
        categoryLabel="Regression Analysis"
        icon={Star}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Galaxy Features</CardTitle>
                <CardDescription>
                  Enter the spectral and positional features of the galaxy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {(Object.keys(formData) as Array<keyof GalaxyInput>).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="flex items-center gap-2">
                        <span className="uppercase font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {field}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {fieldDescriptions[field]}
                        </span>
                      </Label>
                      <Input
                        id={field}
                        type="number"
                        step="0.001"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full mt-6"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Predict Value
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {isLoading && (
              <ResultDisplay
                title="Prediction Result"
                result=""
                isLoading={true}
              />
            )}
            {result && !isLoading && (
              <Card className="bg-card border-border overflow-hidden animate-fade-in">
                <div className="h-1 bg-success" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-display">
                    <Star className="h-5 w-5 text-primary" />
                    Regression Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Predicted Value</p>
                    <p className="text-4xl font-bold text-foreground">
                      {result.predictedValue}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {result.unit}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This prediction is based on the spectral features and redshift 
                    value using a regression model trained on astronomical survey data.
                  </p>
                </CardContent>
              </Card>
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Enter galaxy features and click "Predict" to see results
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