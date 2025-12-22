import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fish, Sparkles, Layers } from 'lucide-react';
import { predictFishCluster, FishInput, FishPrediction } from '@/lib/api';

const defaultValues: FishInput = {
  weight: 242,
  length1: 23.2,
  length2: 25.4,
  length3: 30.0,
  height: 11.52,
  width: 4.02,
};

const fieldDescriptions: Record<keyof FishInput, string> = {
  weight: 'Weight in grams',
  length1: 'Vertical length (cm)',
  length2: 'Diagonal length (cm)',
  length3: 'Cross length (cm)',
  height: 'Height (cm)',
  width: 'Diagonal width (cm)',
};

export default function FishClustering() {
  const [formData, setFormData] = useState<FishInput>(defaultValues);
  const [result, setResult] = useState<FishPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FishInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setResult(null);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await predictFishCluster(formData);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  const clusterColors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500'];

  return (
    <Layout>
      <ProjectPageLayout
        title="Fish Clustering"
        description="Assign fish samples to clusters based on their physical measurements using unsupervised machine learning (K-Means clustering)."
        category="clustering"
        categoryLabel="Unsupervised Learning"
        icon={Fish}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Fish Measurements</CardTitle>
                <CardDescription>
                  Enter the physical measurements of the fish sample
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {(Object.keys(formData) as Array<keyof FishInput>).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="capitalize">
                        {field.replace(/([0-9])/g, ' $1')}
                        <span className="text-muted-foreground text-xs ml-2">
                          ({fieldDescriptions[field]})
                        </span>
                      </Label>
                      <Input
                        id={field}
                        type="number"
                        step="0.01"
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
                  Assign to Cluster
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {isLoading && (
              <Card className="bg-card border-border">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Processing...</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {result && !isLoading && (
              <Card className="bg-card border-border overflow-hidden animate-fade-in">
                <div className={`h-2 ${clusterColors[result.cluster]}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-display">
                    <Layers className="h-5 w-5 text-primary" />
                    Cluster Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${clusterColors[result.cluster]} text-white text-2xl font-bold mb-3`}>
                      {result.cluster}
                    </div>
                    <p className="text-xl font-semibold text-foreground">
                      {result.clusterName}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> Clusters are formed based on similarities 
                      in physical dimensions and weight, grouping fish with similar 
                      characteristics together.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Fish className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Enter measurements and click "Assign" to see the cluster
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