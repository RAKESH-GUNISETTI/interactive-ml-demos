import { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Upload, ImageIcon, Sparkles } from 'lucide-react';
import { predictButterfly, ButterflyPrediction } from '@/lib/api';

export default function ButterflyClassification() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ButterflyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handlePredict = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setResult(null);

    const response = await predictButterfly(selectedFile);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="Butterfly Image Classification"
        description="Upload an image of a butterfly to identify its species using a Convolutional Neural Network (CNN) trained on multiple butterfly species."
        category="cnn"
        categoryLabel="Computer Vision - CNN"
        icon={Bug}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Upload Image</CardTitle>
                <CardDescription>
                  Upload a butterfly image (JPG, PNG) for species identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-muted">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-contain"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={clearSelection}
                        className="flex-1"
                      >
                        Change Image
                      </Button>
                      <Button
                        onClick={handlePredict}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Identify Species
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">About the Model</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  This CNN model was trained to identify various butterfly species 
                  from images. The model uses deep convolutional layers to extract 
                  visual features and classify the species.
                </p>
                <p>
                  <strong>Supported species include:</strong> Monarch, Painted Lady, 
                  Red Admiral, Common Buckeye, Swallowtail, Blue Morpho, and more.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div>
            {isLoading && (
              <ResultDisplay
                title="Classification Result"
                result=""
                isLoading={true}
              />
            )}
            {result && !isLoading && (
              <ResultDisplay
                title="Species Identified"
                result={result.species}
                confidence={result.confidence}
                isPositive={true}
                additionalInfo={
                  <p className="text-sm text-muted-foreground">
                    The model analyzed visual patterns including wing shape, 
                    coloration, and markings to identify this butterfly species.
                  </p>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Upload an image to identify the butterfly species
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