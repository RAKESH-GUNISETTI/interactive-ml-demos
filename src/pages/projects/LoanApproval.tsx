import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { HowItWorks } from '@/components/shared/HowItWorks';
import { SampleInputButton } from '@/components/shared/SampleInputButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Sparkles, CheckCircle2, XCircle, DollarSign, User, Building } from 'lucide-react';
import { predictLoanApproval, LoanInput, LoanPrediction } from '@/lib/api';

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

const defaultValues: LoanInput = {
  applicantIncome: 5000,
  coapplicantIncome: 0,
  loanAmount: 150,
  loanAmountTerm: 360,
  creditHistory: 1,
  gender: 'Male',
  married: 'Yes',
  education: 'Graduate',
  selfEmployed: 'No',
  propertyArea: 'Urban',
};

const sampleProfiles = [
  {
    label: 'Strong Applicant',
    value: { ...defaultValues, applicantIncome: 8000, creditHistory: 1 as const, education: 'Graduate' as const },
  },
  {
    label: 'High Risk Profile',
    value: { ...defaultValues, applicantIncome: 2500, creditHistory: 0 as const, loanAmount: 300 },
  },
  {
    label: 'Self-Employed',
    value: { ...defaultValues, selfEmployed: 'Yes' as const, applicantIncome: 6000, propertyArea: 'Semiurban' as const },
  },
];

export default function LoanApproval() {
  const [formData, setFormData] = useState<LoanInput>(defaultValues);
  const [result, setResult] = useState<LoanPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoanInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleSampleSelect = (profile: LoanInput) => {
    setFormData(profile);
    setResult(null);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setResult(null);

    const response = await predictLoanApproval(formData);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <ProjectPageLayout
        title="Loan Approval Prediction"
        description="Predict loan approval likelihood based on applicant information, financial details, and credit history using machine learning."
        category="classification"
        categoryLabel="Binary Classification"
        icon={Landmark}
      >
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
              <CardHeader className="relative">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  Applicant Information
                </CardTitle>
                <CardDescription>
                  Complete all fields for accurate loan approval prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Income Fields */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label htmlFor="applicantIncome" className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary/70" />
                      Applicant Income
                      <span className="text-xs text-muted-foreground">($/month)</span>
                    </Label>
                    <Input
                      id="applicantIncome"
                      type="number"
                      value={formData.applicantIncome}
                      onChange={(e) => handleInputChange('applicantIncome', Number(e.target.value))}
                      className="rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-muted/50"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Label htmlFor="coapplicantIncome" className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary/70" />
                      Co-applicant Income
                      <span className="text-xs text-muted-foreground">($/month)</span>
                    </Label>
                    <Input
                      id="coapplicantIncome"
                      type="number"
                      value={formData.coapplicantIncome}
                      onChange={(e) => handleInputChange('coapplicantIncome', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  {/* Loan Fields */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="loanAmount" className="flex items-center gap-2">
                      Loan Amount
                      <span className="text-xs text-muted-foreground">(K$)</span>
                    </Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Label htmlFor="loanAmountTerm" className="flex items-center gap-2">
                      Loan Term
                      <span className="text-xs text-muted-foreground">(months)</span>
                    </Label>
                    <Input
                      id="loanAmountTerm"
                      type="number"
                      value={formData.loanAmountTerm}
                      onChange={(e) => handleInputChange('loanAmountTerm', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  {/* Select Fields */}
                  {[
                    { field: 'creditHistory', label: 'Credit History', options: [{ v: '1', l: 'Good (Meets guidelines)' }, { v: '0', l: 'Poor (Does not meet)' }] },
                    { field: 'gender', label: 'Gender', options: [{ v: 'Male', l: 'Male' }, { v: 'Female', l: 'Female' }] },
                    { field: 'married', label: 'Marital Status', options: [{ v: 'Yes', l: 'Married' }, { v: 'No', l: 'Single' }] },
                    { field: 'education', label: 'Education Level', options: [{ v: 'Graduate', l: 'Graduate' }, { v: 'Not Graduate', l: 'Not Graduate' }] },
                    { field: 'selfEmployed', label: 'Employment Type', options: [{ v: 'No', l: 'Salaried' }, { v: 'Yes', l: 'Self-Employed' }] },
                    { field: 'propertyArea', label: 'Property Location', options: [{ v: 'Urban', l: 'Urban' }, { v: 'Semiurban', l: 'Semiurban' }, { v: 'Rural', l: 'Rural' }] },
                  ].map((item, idx) => (
                    <motion.div 
                      key={item.field}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      <Label>{item.label}</Label>
                      <Select
                        value={String(formData[item.field as keyof LoanInput])}
                        onValueChange={(v) => handleInputChange(item.field as keyof LoanInput, item.field === 'creditHistory' ? Number(v) : v)}
                      >
                        <SelectTrigger className="rounded-xl bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((opt) => (
                            <SelectItem key={opt.v} value={opt.v}>{opt.l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity group"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Predict Loan Approval
                </Button>
              </CardContent>
            </Card>

            {/* Sample Profiles */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4 text-accent" />
                  Try Sample Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex flex-wrap gap-2">
                {sampleProfiles.map((profile, idx) => (
                  <SampleInputButton
                    key={idx}
                    label={profile.label}
                    onClick={() => handleSampleSelect(profile.value)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* How It Works */}
            <HowItWorks
              modelName="Random Forest / Gradient Boosting"
              description="This model analyzes multiple factors to predict loan approval likelihood. It considers income-to-loan ratios, credit history, and demographic factors to assess risk."
              keyFactors={[
                'Credit history (most important)',
                'Income-to-loan ratio',
                'Education level',
                'Property location',
                'Employment stability',
                'Combined household income',
              ]}
              technicalDetails="Model: Random Forest Classifier | Features: 10 | Accuracy: ~82%"
            />
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
                  <p className="text-muted-foreground mt-6 font-medium">Evaluating application...</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Analyzing risk factors</p>
                </CardContent>
              </Card>
            )}
            {result && !isLoading && (
              <ResultDisplay
                title="Loan Decision"
                result={result.approved ? 'Approved' : 'Rejected'}
                confidence={result.confidence}
                isPositive={result.approved}
                icon={result.approved ? CheckCircle2 : XCircle}
                additionalInfo={
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {result.approved
                        ? 'Based on the provided information, this application meets the approval criteria with favorable risk assessment.'
                        : 'The application does not meet current criteria. Consider improving credit history or adjusting loan parameters.'}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Key factors considered:</strong></p>
                      <p>• Credit History • Income Ratio • Education</p>
                    </div>
                  </div>
                }
              />
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
                      <Landmark className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  </motion.div>
                  <p className="text-muted-foreground font-medium mt-6">
                    Complete the form to predict
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Results will appear here
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
