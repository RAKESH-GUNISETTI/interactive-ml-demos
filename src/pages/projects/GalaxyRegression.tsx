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
import { Star, Sparkles, HelpCircle, Orbit, Telescope } from 'lucide-react';
import { predictGalaxy, GalaxyInput, GalaxyPrediction } from '@/lib/api';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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

const fieldDescriptions: Record<keyof GalaxyInput, { label: string; tooltip: string }> = {
  ra: { label: 'Right Ascension', tooltip: 'Angular distance measured eastward along the celestial equator (0-360°)' },
  dec: { label: 'Declination', tooltip: 'Angular distance north or south of celestial equator (-90° to +90°)' },
  u: { label: 'Ultraviolet (u)', tooltip: 'Ultraviolet band magnitude - measures UV light emission' },
  g: { label: 'Green (g)', tooltip: 'Green band magnitude - measures visible green light' },
  r: { label: 'Red (r)', tooltip: 'Red band magnitude - measures visible red light' },
  i: { label: 'Near-Infrared (i)', tooltip: 'Near-infrared band magnitude' },
  z: { label: 'Infrared (z)', tooltip: 'Infrared band magnitude - measures heat emission' },
  redshift: { label: 'Redshift', tooltip: 'Measure of how much light has shifted toward red wavelengths (indicates distance/velocity)' },
};

const sampleGalaxies = [
  { label: 'Distant Galaxy', value: { ...defaultValues, redshift: 0.85, u: 20.1, g: 18.2 } },
  { label: 'Nearby Galaxy', value: { ...defaultValues, redshift: 0.12, u: 16.5, g: 14.8 } },
  { label: 'Quasar-like', value: { ...defaultValues, redshift: 2.1, u: 21.5, g: 19.8, r: 18.5 } },
];

export default function GalaxyRegression() {
  const [formData, setFormData] = useState<GalaxyInput>(defaultValues);
  const [result, setResult] = useState<GalaxyPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof GalaxyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setResult(null);
  };

  const handleSampleSelect = (sample: GalaxyInput) => {
    setFormData(sample);
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Telescope className="h-5 w-5 text-primary" />
                    </div>
                    Galaxy Features
                  </CardTitle>
                  <CardDescription>
                    Enter spectral and positional features for regression analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {(Object.keys(formData) as Array<keyof GalaxyInput>).map((field, idx) => (
                      <motion.div 
                        key={field} 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Label htmlFor={field} className="flex items-center gap-2">
                          <span className="uppercase font-mono text-xs bg-gradient-to-r from-primary/20 to-accent/20 px-2 py-0.5 rounded-md border border-primary/20">
                            {field}
                          </span>
                          <span className="text-muted-foreground text-xs flex-1">
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
                          step="0.001"
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
                    Predict Value
                  </Button>
                </CardContent>
              </Card>

              {/* Sample Inputs */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Orbit className="h-4 w-4 text-accent" />
                    Try Sample Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative flex flex-wrap gap-2">
                  {sampleGalaxies.map((sample, idx) => (
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
                modelName="Gradient Boosting Regressor"
                description="This regression model predicts continuous astronomical values by analyzing the relationship between spectral features and physical properties of galaxies."
                keyFactors={[
                  'Redshift (distance indicator)',
                  'Magnitude ratios (color indices)',
                  'Spectral energy distribution',
                  'Position in sky',
                  'UV to infrared spread',
                  'Luminosity features',
                ]}
                technicalDetails="Model: XGBoost/LightGBM | Features: 8 spectral bands | R² Score: ~0.91"
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
                    <p className="text-muted-foreground mt-6 font-medium">Computing regression...</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Analyzing spectral data</p>
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
                    <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-2 text-lg font-display">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        Regression Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="text-center p-8 bg-gradient-to-br from-muted/80 via-muted/50 to-transparent rounded-2xl border border-border/50">
                        <p className="text-sm text-muted-foreground mb-3">Predicted Value</p>
                        <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          <AnimatedCounter value={result.predictedValue} decimals={4} />
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 px-3 py-1 bg-muted/50 rounded-full inline-block">
                          {result.unit}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This prediction is based on spectral features and redshift 
                        value using a regression model trained on astronomical survey data.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted rounded-lg">Regression</span>
                        <span className="px-2 py-1 bg-muted rounded-lg">SDSS Data</span>
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
                        <Star className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    </motion.div>
                    <p className="text-muted-foreground font-medium mt-6">
                      Enter galaxy features
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Prediction will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>
        </TooltipProvider>
      </ProjectPageLayout>
    </Layout>
  );
}
