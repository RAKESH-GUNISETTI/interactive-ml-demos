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

const defaultValues: LoanInput = {
  person_age: 30,
  person_gender: 'Male',
  person_education: 'Bachelor',
  person_income: 50000,
  person_emp_exp: 5,
  person_home_ownership: 'RENT',
  loan_amnt: 10000,
  loan_intent: 'PERSONAL',
  loan_int_rate: 10.5,
  loan_percent_income: 0.2,
  cb_person_cred_hist_length: 5,
  credit_score: 700,
  previous_loan_defaults_on_file: 'No',
};

const sampleProfiles = [
  {
    label: 'Strong Applicant',
    value: {
      ...defaultValues,
      person_age: 35,
      person_income: 80000,
      credit_score: 780,
      person_education: 'Master' as const,
      person_emp_exp: 10,
      loan_percent_income: 0.1,
    },
  },
  {
    label: 'High Risk Profile',
    value: {
      ...defaultValues,
      person_age: 25,
      person_income: 30000,
      credit_score: 550,
      previous_loan_defaults_on_file: 'Yes' as const,
      loan_percent_income: 0.4,
    },
  },
  {
    label: 'Business Venture',
    value: {
      ...defaultValues,
      person_age: 40,
      loan_intent: 'VENTURE' as const,
      loan_amnt: 25000,
      person_home_ownership: 'OWN' as const,
      credit_score: 720,
      person_income: 75000,
    },
  },
];

// Validation function
function validateLoanInput(input: LoanInput): string | null {
  if (input.credit_score < 300 || input.credit_score > 900) {
    return 'Credit score must be between 300 and 900';
  }
  if (input.loan_percent_income < 0 || input.loan_percent_income > 1) {
    return 'Loan percent of income must be between 0 and 1';
  }
  if (input.person_age <= 0) {
    return 'Age must be a positive number';
  }
  if (input.person_income <= 0) {
    return 'Income must be a positive number';
  }
  if (input.loan_amnt <= 0) {
    return 'Loan amount must be a positive number';
  }
  return null;
}

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
    const validationError = validateLoanInput(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    setResult(null);

    const response = await predictLoanApproval(formData);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast.error(response.error || 'Failed to get prediction');
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Info */}
                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Label htmlFor="person_age">Age</Label>
                    <Input
                      id="person_age"
                      type="number"
                      value={formData.person_age}
                      onChange={(e) => handleInputChange('person_age', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                    <Label>Gender</Label>
                    <Select value={formData.person_gender} onValueChange={(v) => handleInputChange('person_gender', v)}>
                      <SelectTrigger className="rounded-xl bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                    <Label>Education</Label>
                    <Select value={formData.person_education} onValueChange={(v) => handleInputChange('person_education', v)}>
                      <SelectTrigger className="rounded-xl bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                    <Label htmlFor="person_income" className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary/70" />
                      Annual Income
                    </Label>
                    <Input
                      id="person_income"
                      type="number"
                      value={formData.person_income}
                      onChange={(e) => handleInputChange('person_income', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                    <Label htmlFor="person_emp_exp">Employment Experience (years)</Label>
                    <Input
                      id="person_emp_exp"
                      type="number"
                      value={formData.person_emp_exp}
                      onChange={(e) => handleInputChange('person_emp_exp', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Label>Home Ownership</Label>
                    <Select value={formData.person_home_ownership} onValueChange={(v) => handleInputChange('person_home_ownership', v)}>
                      <SelectTrigger className="rounded-xl bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RENT">Rent</SelectItem>
                        <SelectItem value="OWN">Own</SelectItem>
                        <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Loan Details */}
                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                    <Label htmlFor="loan_amnt">Loan Amount ($)</Label>
                    <Input
                      id="loan_amnt"
                      type="number"
                      value={formData.loan_amnt}
                      onChange={(e) => handleInputChange('loan_amnt', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                    <Label>Loan Intent</Label>
                    <Select value={formData.loan_intent} onValueChange={(v) => handleInputChange('loan_intent', v)}>
                      <SelectTrigger className="rounded-xl bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="EDUCATION">Education</SelectItem>
                        <SelectItem value="MEDICAL">Medical</SelectItem>
                        <SelectItem value="VENTURE">Venture</SelectItem>
                        <SelectItem value="HOMEIMPROVEMENT">Home Improvement</SelectItem>
                        <SelectItem value="DEBTCONSOLIDATION">Debt Consolidation</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                    <Label htmlFor="loan_int_rate">Interest Rate (%)</Label>
                    <Input
                      id="loan_int_rate"
                      type="number"
                      step="0.1"
                      value={formData.loan_int_rate}
                      onChange={(e) => handleInputChange('loan_int_rate', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                    <Label htmlFor="loan_percent_income">Loan % of Income (0-1)</Label>
                    <Input
                      id="loan_percent_income"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.loan_percent_income}
                      onChange={(e) => handleInputChange('loan_percent_income', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  {/* Credit Info */}
                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Label htmlFor="credit_score">Credit Score (300-900)</Label>
                    <Input
                      id="credit_score"
                      type="number"
                      min="300"
                      max="900"
                      value={formData.credit_score}
                      onChange={(e) => handleInputChange('credit_score', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                    <Label htmlFor="cb_person_cred_hist_length">Credit History Length (years)</Label>
                    <Input
                      id="cb_person_cred_hist_length"
                      type="number"
                      value={formData.cb_person_cred_hist_length}
                      onChange={(e) => handleInputChange('cb_person_cred_hist_length', Number(e.target.value))}
                      className="rounded-xl bg-muted/50"
                    />
                  </motion.div>

                  <motion.div className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
                    <Label>Previous Loan Defaults</Label>
                    <Select value={formData.previous_loan_defaults_on_file} onValueChange={(v) => handleInputChange('previous_loan_defaults_on_file', v)}>
                      <SelectTrigger className="rounded-xl bg-muted/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
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
              description="This model analyzes multiple factors to predict loan approval likelihood. It considers income, credit score, employment history, and loan parameters."
              keyFactors={[
                'Credit score (300-900)',
                'Income to loan ratio',
                'Employment experience',
                'Previous default history',
                'Home ownership status',
                'Loan intent category',
              ]}
              technicalDetails="Model: Gradient Boosting Classifier | Features: 13 | Accuracy: ~85%"
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
                        : 'The application does not meet current criteria. Consider improving credit score or adjusting loan parameters.'}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Key factors considered:</strong></p>
                      <p>• Credit Score • Income Ratio • Employment History</p>
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
