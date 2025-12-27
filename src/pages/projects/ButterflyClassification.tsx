import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Upload, ImageIcon, Sparkles, X } from 'lucide-react';
import { predictButterfly, ButterflyPrediction } from '@/lib/api';

export default function ButterflyClassification() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ButterflyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
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
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl">Upload Image</CardTitle>
                <CardDescription>
                  Upload a clear butterfly image for species identification
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

                <AnimatePresence mode="wait">
                  {!previewUrl ? (
                    <motion.div
                      key="dropzone"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`
                        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer 
                        transition-all duration-300
                        ${isDragOver 
                          ? 'border-primary bg-primary/10 scale-[1.02]' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                    >
                      <motion.div
                        animate={{ y: isDragOver ? -5 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="text-foreground font-medium">
                          {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-muted group">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-contain"
                        />
                        <button
                          onClick={clearSelection}
                          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
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
                          className="flex-1 group"
                        >
                          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                          Identify Species
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* How It Works */}
            <HowItWorks
              modelName="Convolutional Neural Network (CNN)"
              description="This deep learning model uses multiple convolutional layers to extract visual features from butterfly images. It analyzes wing patterns, colors, and shapes to classify species."
              keyFactors={[
                'Wing pattern recognition',
                'Color distribution analysis',
                'Shape and structure detection',
                'Distinctive markings',
                'Size and proportion features',
                'Texture patterns',
              ]}
              technicalDetails="Architecture: ResNet/EfficientNet | Classes: 75+ Species | Top-5 Accuracy: ~95%"
            />

            {/* Supported Species */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Supported Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Monarch', 'Painted Lady', 'Red Admiral', 'Swallowtail', 'Blue Morpho', 'Peacock', 'Common Buckeye'].map((species) => (
                    <span key={species} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                      {species}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    +68 more
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading && (
              <ResultDisplay
                title="Analyzing Image..."
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
                icon={Bug}
                additionalInfo={
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      The model analyzed visual patterns including wing shape, 
                      coloration, and markings to identify this butterfly species.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">CNN Analysis</span>
                      <span className="px-2 py-1 bg-muted rounded">Pattern Matching</span>
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
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    Upload an image to identify
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Species classification will appear here
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
