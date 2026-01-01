import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { SampleInputButton } from '@/components/shared/SampleInputButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Fish, Sparkles, Layers, HelpCircle, Waves, Scale } from 'lucide-react';
import { predictFishCluster, FishInput, FishPrediction } from '@/lib/api';
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

// Form state uses length and weight, w_l_ratio is computed
interface FormState {
  length: number;
  weight: number;
}

const defaultFormValues: FormState = {
  length: 25.0,
  weight: 300,
};

const fieldDescriptions: Record<keyof FormState, { label: string; tooltip: string }> = {
  length: { label: 'Length (cm)', tooltip: 'Total length of the fish from nose to tail in centimeters' },
  weight: { label: 'Weight (g)', tooltip: 'Total weight of the fish in grams' },
};

const sampleFish = [
  { label: 'Small Fish', value: { length: 15.0, weight: 80 } },
  { label: 'Medium Fish', value: { length: 28.0, weight: 400 } },
  { label: 'Large Fish', value: { length: 42.0, weight: 900 } },
];

const clusterStyles = [
  { bg: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500/30', text: 'text-blue-500' },
  { bg: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-500/30', text: 'text-emerald-500' },
  { bg: 'from-orange-500 to-amber-500', ring: 'ring-orange-500/30', text: 'text-orange-500' },
  { bg: 'from-purple-500 to-pink-500', ring: 'ring-purple-500/30', text: 'text-purple-500' },
  { bg: 'from-red-500 to-rose-500', ring: 'ring-red-500/30', text: 'text-red-500' },
];

export default function FishClustering() {
  const [formData, setFormData] = useState<FormState>(defaultFormValues);
  const [wlRatio, setWlRatio] = useState<number>(0);
  const [result, setResult] = useState<FishPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Compute w_l_ratio whenever length or weight changes
  useEffect(() => {
    if (formData.length > 0) {
      setWlRatio(formData.weight / formData.length);
    } else {
      setWlRatio(0);
    }
  }, [formData.length, formData.weight]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setResult(null);
  };

  const handleSampleSelect = (sample: FormState) => {
    setFormData(sample);
    setResult(null);
  };

  const handlePredict = async () => {
    if (formData.length <= 0) {
      toast.error('Length must be a positive number');
      return;
    }
    if (formData.weight <= 0) {
      toast.error('Weight must be a positive number');
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Build the exact API payload
    const apiInput: FishInput = {
      length: formData.length,
      weight: formData.weight,
      w_l_ratio: formData.weight / formData.length,
    };

    const response = await predictFishCluster(apiInput);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast.error(response.error || 'Failed to get prediction');
    }
    setIsLoading(false);
  };

  const getClusterStyle = (clusterId: number) => {
    return clusterStyles[clusterId % clusterStyles.length];
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="Fish Clustering"
        description="Assign fish samples to clusters based on their physical measurements using unsupervised machine learning (K-Means clustering)."
        category="clustering"
        categoryLabel="Unsupervised Learning"
        icon={Fish}
      >
        <TooltipProvider>
          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Form Section */}
            <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    Fish Measurements
                  </CardTitle>
                  <CardDescription>
                    Enter length and weight - the ratio is calculated automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {(Object.keys(formData) as Array<keyof FormState>).map((field, idx) => (
                      <motion.div 
                        key={field} 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Label htmlFor={field} className="flex items-center gap-2">
                          <span className="capitalize flex-1">
                            {fieldDescriptions[field].label}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[200px]">
                              <p className="text-xs">{fieldDescriptions[field].tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id={field}
                          type="number"
                          step="0.01"
                          value={formData[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className="rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-muted/50"
                        />
                      </motion.div>
                    ))}

                    {/* Computed w_l_ratio display */}
                    <motion.div 
                      className="space-y-2 sm:col-span-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Label className="flex items-center gap-2">
                        <span className="flex-1">Weight/Length Ratio (computed)</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p className="text-xs">Automatically calculated as weight ÷ length (g/cm)</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="px-4 py-3 rounded-xl bg-muted/80 border border-border/50 font-mono text-lg">
                        {wlRatio.toFixed(4)} <span className="text-muted-foreground text-sm">g/cm</span>
                      </div>
                    </motion.div>
                  </div>

                  <Button
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="w-full mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Assign to Cluster
                  </Button>
                </CardContent>
              </Card>

              {/* Sample Inputs */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Waves className="h-4 w-4 text-accent" />
                    Try Sample Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative flex flex-wrap gap-2">
                  {sampleFish.map((sample, idx) => (
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
                modelName="K-Means Clustering"
                description="This unsupervised learning algorithm groups fish into clusters based on similarity in their physical measurements. It finds natural groupings without predefined labels."
                keyFactors={[
                  'Fish length (cm)',
                  'Fish weight (g)',
                  'Weight-to-length ratio',
                  'Cluster distance metrics',
                  'Centroid similarity',
                ]}
                technicalDetails="Algorithm: K-Means | Features: 3 (length, weight, w_l_ratio) | Silhouette Score: ~0.72"
              />
            </motion.div>

            {/* Result Section */}
            <motion.div className="space-y-6" variants={itemVariants}>
              {isLoading && (
                <Card className="bg-gradient-to-br from-card via-card to-muted/30 border-border/50 overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="h-20 w-20 border-4 border-primary/20 rounded-full" />
                      <div className="absolute inset-0 h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-2 h-16 w-16 border-4 border-accent/30 border-b-transparent rounded-full animate-spin-slow" />
                    </div>
                    <p className="text-muted-foreground mt-6 font-medium">Analyzing clusters...</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Processing measurements</p>
                  </CardContent>
                </Card>
              )}
              {result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-border/50 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`h-2 bg-gradient-to-r ${getClusterStyle(result.cluster_id).bg}`} />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-2 text-lg font-display">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Layers className="h-5 w-5 text-primary" />
                        </div>
                        Cluster Assignment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="text-center p-8 bg-gradient-to-br from-muted/80 via-muted/50 to-transparent rounded-2xl">
                        <motion.div 
                          className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${getClusterStyle(result.cluster_id).bg} text-white text-4xl font-bold mb-4 shadow-xl ring-4 ${getClusterStyle(result.cluster_id).ring}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          {result.cluster_id}
                        </motion.div>
                        <p className="text-2xl font-semibold text-foreground">
                          {result.cluster_label}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          <strong>Input Summary:</strong><br />
                          Length: {formData.length} cm | Weight: {formData.weight} g | Ratio: {wlRatio.toFixed(2)} g/cm
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded-lg">K-Means</span>
                        <span className="px-2 py-1 bg-muted rounded-lg">Unsupervised</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {!result && !isLoading && (
                <Card className="bg-gradient-to-br from-muted/20 via-transparent to-muted/20 border-dashed border-2 border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                      <div className="relative p-6 rounded-3xl bg-muted/50">
                        <Fish className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    </motion.div>
                    <p className="text-muted-foreground font-medium mt-6">
                      Enter measurements
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Cluster assignment will appear here
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cluster Info */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent" />
                    About Clustering
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-sm text-muted-foreground">
                    The model groups fish based on their length, weight, and the computed 
                    weight-to-length ratio. Each cluster represents a distinct fish category 
                    identified by the algorithm.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TooltipProvider>
      </ProjectPageLayout>
    </Layout>
  );
}
