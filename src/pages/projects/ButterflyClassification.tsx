import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, Upload, ImageIcon, Sparkles, X, Zap } from 'lucide-react';
import { predictButterfly, ButterflyPrediction } from '@/lib/api';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Accepted file types matching backend requirements
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export default function ButterflyClassification() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ButterflyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(`Invalid file type. Accepted formats: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      return false;
    }
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
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
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    setResult(null);

    // The API function handles multipart/form-data with field name "image"
    const response = await predictButterfly(selectedFile);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast.error(response.error || 'Failed to classify image');
    }
    setIsLoading(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
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
        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Upload Section */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Upload a clear butterfly image (JPG, JPEG, or PNG only)
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
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
                        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer 
                        transition-all duration-300 overflow-hidden
                        ${isDragOver 
                          ? 'border-primary bg-primary/10 scale-[1.02]' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity" />
                      <motion.div
                        animate={{ y: isDragOver ? -5 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <div className={`mx-auto mb-4 p-4 rounded-2xl transition-all duration-300 ${isDragOver ? 'bg-primary/20' : 'bg-muted'}`}>
                          <Upload className={`h-10 w-10 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <p className="text-foreground font-medium">
                          {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, JPEG, PNG up to 10MB
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
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 group/preview">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                        <button
                          onClick={clearSelection}
                          className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-xl opacity-0 group-hover/preview:opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>File:</strong> {selectedFile?.name}</p>
                        <p><strong>Size:</strong> {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB</p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={clearSelection}
                          className="flex-1 rounded-xl"
                        >
                          Change Image
                        </Button>
                        <Button
                          onClick={handlePredict}
                          disabled={isLoading}
                          className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group/btn"
                        >
                          <Sparkles className="mr-2 h-4 w-4 group-hover/btn:animate-pulse" />
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

            {/* Supported Formats */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  Accepted Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex flex-wrap gap-2">
                  {ACCEPTED_EXTENSIONS.map((ext, idx) => (
                    <motion.span 
                      key={ext} 
                      className="px-3 py-1.5 bg-muted/80 text-muted-foreground text-sm rounded-full border border-border/50 font-mono"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {ext}
                    </motion.span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Maximum file size: 10MB. One image per request.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Section */}
          <motion.div variants={itemVariants}>
            {isLoading && (
              <Card className="bg-gradient-to-br from-card via-card to-muted/30 border-border/50 overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="h-20 w-20 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-2 h-16 w-16 border-4 border-accent/30 border-b-transparent rounded-full animate-spin-slow" />
                  </div>
                  <p className="text-muted-foreground mt-6 font-medium">Analyzing image patterns...</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">AI is processing your butterfly image</p>
                </CardContent>
              </Card>
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
                      <span className="px-2 py-1 bg-muted rounded-lg">CNN Analysis</span>
                      <span className="px-2 py-1 bg-muted rounded-lg">Pattern Matching</span>
                    </div>
                  </div>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-gradient-to-br from-muted/20 via-transparent to-muted/20 border-dashed border-2 border-border/50 h-full min-h-[300px]">
                <CardContent className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                    <div className="relative p-6 rounded-3xl bg-muted/50">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </motion.div>
                  <p className="text-muted-foreground font-medium mt-6">
                    Upload an image to identify
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Species classification will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </ProjectPageLayout>
    </Layout>
  );
}
