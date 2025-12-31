import { useState } from 'react';
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

const defaultValues: FishInput = {
  weight: 242,
  length1: 23.2,
  length2: 25.4,
  length3: 30.0,
  height: 11.52,
  width: 4.02,
};

const fieldDescriptions: Record<keyof FishInput, { label: string; tooltip: string }> = {
  weight: { label: 'Weight (g)', tooltip: 'Total weight of the fish in grams' },
  length1: { label: 'Vertical Length', tooltip: 'Length from nose to tail measured vertically (cm)' },
  length2: { label: 'Diagonal Length', tooltip: 'Diagonal measurement from nose to tail (cm)' },
  length3: { label: 'Cross Length', tooltip: 'Cross-sectional length measurement (cm)' },
  height: { label: 'Height', tooltip: 'Maximum height of the fish body (cm)' },
  width: { label: 'Width', tooltip: 'Maximum width/thickness of the fish (cm)' },
};

const sampleFish = [
  { label: 'Small Fish', value: { weight: 120, length1: 18.5, length2: 20.2, length3: 23.5, height: 8.2, width: 3.1 } },
  { label: 'Medium Fish', value: { weight: 450, length1: 28.0, length2: 30.5, length3: 35.2, height: 14.5, width: 5.8 } },
  { label: 'Large Fish', value: { weight: 850, length1: 38.5, length2: 42.0, length3: 48.5, height: 19.2, width: 7.5 } },
];

const clusterStyles = [
  { bg: 'from-blue-500 to-cyan-500', ring: 'ring-blue-500/30', text: 'text-blue-500' },
  { bg: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-500/30', text: 'text-emerald-500' },
  { bg: 'from-orange-500 to-amber-500', ring: 'ring-orange-500/30', text: 'text-orange-500' },
];

export default function FishClustering() {
  const [formData, setFormData] = useState<FishInput>(defaultValues);
  const [result, setResult] = useState<FishPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FishInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setResult(null);
  };

  const handleSampleSelect = (sample: FishInput) => {
    setFormData(sample);
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
                    Enter the physical measurements of the fish sample
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {(Object.keys(formData) as Array<keyof FishInput>).map((field, idx) => (
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
                  'Weight-to-length ratio',
                  'Body proportions',
                  'Overall size metrics',
                  'Height-to-width ratio',
                  'Length measurements correlation',
                  'Physical dimension patterns',
                ]}
                technicalDetails="Algorithm: K-Means | Clusters: 3 | Features: 6 physical measurements | Silhouette Score: ~0.72"
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
                    <div className={`h-2 bg-gradient-to-r ${clusterStyles[result.cluster].bg}`} />
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
                          className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${clusterStyles[result.cluster].bg} text-white text-4xl font-bold mb-4 shadow-xl ring-4 ${clusterStyles[result.cluster].ring}`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          {result.cluster}
                        </motion.div>
                        <p className="text-2xl font-semibold text-foreground">
                          {result.clusterName}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.description}
                      </p>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> Clusters are formed based on similarities 
                          in physical dimensions and weight, grouping fish with similar 
                          characteristics together.
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

              {/* Cluster Legend */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-4 w-4 text-accent" />
                    Cluster Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {[
                    { id: 0, name: 'Small Fish', desc: 'Lower weight, shorter lengths' },
                    { id: 1, name: 'Medium Fish', desc: 'Balanced proportions' },
                    { id: 2, name: 'Large Fish', desc: 'Higher weight, longer body' },
                  ].map((cluster, idx) => (
                    <motion.div 
                      key={cluster.id} 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${clusterStyles[cluster.id].bg} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                        {cluster.id}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{cluster.name}</p>
                        <p className="text-xs text-muted-foreground">{cluster.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TooltipProvider>
      </ProjectPageLayout>
    </Layout>
  );
}
