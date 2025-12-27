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
import { Landmark, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { predictLoanApproval, LoanInput, LoanPrediction } from '@/lib/api';

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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl">Applicant Information</CardTitle>
                <CardDescription>
                  Complete all fields for accurate loan approval prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Income Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantIncome" className="flex items-center gap-2">
                      Applicant Income
                      <span className="text-xs text-muted-foreground">($/month)</span>
                    </Label>
                    <Input
                      id="applicantIncome"
                      type="number"
                      value={formData.applicantIncome}
                      onChange={(e) => handleInputChange('applicantIncome', Number(e.target.value))}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coapplicantIncome" className="flex items-center gap-2">
                      Co-applicant Income
                      <span className="text-xs text-muted-foreground">($/month)</span>
                    </Label>
                    <Input
                      id="coapplicantIncome"
                      type="number"
                      value={formData.coapplicantIncome}
                      onChange={(e) => handleInputChange('coapplicantIncome', Number(e.target.value))}
                    />
                  </div>

                  {/* Loan Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount" className="flex items-center gap-2">
                      Loan Amount
                      <span className="text-xs text-muted-foreground">(K$)</span>
                    </Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmountTerm" className="flex items-center gap-2">
                      Loan Term
                      <span className="text-xs text-muted-foreground">(months)</span>
                    </Label>
                    <Input
                      id="loanAmountTerm"
                      type="number"
                      value={formData.loanAmountTerm}
                      onChange={(e) => handleInputChange('loanAmountTerm', Number(e.target.value))}
                    />
                  </div>

                  {/* Credit History */}
                  <div className="space-y-2">
                    <Label>Credit History</Label>
                    <Select
                      value={String(formData.creditHistory)}
                      onValueChange={(v) => handleInputChange('creditHistory', Number(v) as 0 | 1)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Good (Meets guidelines)</SelectItem>
                        <SelectItem value="0">Poor (Does not meet)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleInputChange('gender', v as 'Male' | 'Female')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Married */}
                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                    <Select
                      value={formData.married}
                      onValueChange={(v) => handleInputChange('married', v as 'Yes' | 'No')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Married</SelectItem>
                        <SelectItem value="No">Single</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label>Education Level</Label>
                    <Select
                      value={formData.education}
                      onValueChange={(v) => handleInputChange('education', v as 'Graduate' | 'Not Graduate')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Self Employed */}
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select
                      value={formData.selfEmployed}
                      onValueChange={(v) => handleInputChange('selfEmployed', v as 'Yes' | 'No')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">Salaried</SelectItem>
                        <SelectItem value="Yes">Self-Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Area */}
                  <div className="space-y-2">
                    <Label>Property Location</Label>
                    <Select
                      value={formData.propertyArea}
                      onValueChange={(v) => handleInputChange('propertyArea', v as 'Urban' | 'Semiurban' | 'Rural')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Semiurban">Semiurban</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full mt-6 group"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Predict Loan Approval
                </Button>
              </CardContent>
            </Card>

            {/* Sample Profiles */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Try Sample Profiles</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading && (
              <ResultDisplay
                title="Evaluating Application..."
                result=""
                isLoading={true}
              />
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
              <Card className="bg-muted/30 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Landmark className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">
                    Complete the form to predict
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Results will appear here
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
