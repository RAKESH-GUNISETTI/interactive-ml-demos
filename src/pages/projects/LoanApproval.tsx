import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProjectPageLayout } from '@/components/shared/ProjectPageLayout';
import { ResultDisplay } from '@/components/shared/ResultDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Sparkles } from 'lucide-react';
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

export default function LoanApproval() {
  const [formData, setFormData] = useState<LoanInput>(defaultValues);
  const [result, setResult] = useState<LoanPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoanInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        description="Predict whether a loan application will be approved based on applicant information, income details, and credit history."
        category="classification"
        categoryLabel="Binary Classification"
        icon={Landmark}
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl">Applicant Information</CardTitle>
                <CardDescription>
                  Fill in all fields to get a loan approval prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Income Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="applicantIncome">Applicant Income ($)</Label>
                    <Input
                      id="applicantIncome"
                      type="number"
                      value={formData.applicantIncome}
                      onChange={(e) => handleInputChange('applicantIncome', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coapplicantIncome">Co-applicant Income ($)</Label>
                    <Input
                      id="coapplicantIncome"
                      type="number"
                      value={formData.coapplicantIncome}
                      onChange={(e) => handleInputChange('coapplicantIncome', Number(e.target.value))}
                    />
                  </div>

                  {/* Loan Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (K$)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmountTerm">Loan Term (months)</Label>
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
                        <SelectItem value="1">Good (1)</SelectItem>
                        <SelectItem value="0">Poor (0)</SelectItem>
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
                    <Label>Married</Label>
                    <Select
                      value={formData.married}
                      onValueChange={(v) => handleInputChange('married', v as 'Yes' | 'No')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label>Education</Label>
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
                    <Label>Self Employed</Label>
                    <Select
                      value={formData.selfEmployed}
                      onValueChange={(v) => handleInputChange('selfEmployed', v as 'Yes' | 'No')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Area */}
                  <div className="space-y-2">
                    <Label>Property Area</Label>
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
                  className="w-full mt-6"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Predict Loan Approval
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div>
            {isLoading && (
              <ResultDisplay
                title="Prediction Result"
                result=""
                isLoading={true}
              />
            )}
            {result && !isLoading && (
              <ResultDisplay
                title="Loan Decision"
                result={result.approved ? 'Loan Approved' : 'Loan Rejected'}
                confidence={result.confidence}
                isPositive={result.approved}
                additionalInfo={
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      {result.approved
                        ? 'Based on the provided information, this loan application meets the approval criteria.'
                        : 'The application does not meet the required criteria. Consider improving credit history or adjusting loan parameters.'}
                    </p>
                    <p className="text-xs">
                      Key factors: Credit History, Income-to-Loan ratio, Education level
                    </p>
                  </div>
                }
              />
            )}
            {!result && !isLoading && (
              <Card className="bg-muted/50 border-dashed border-2 border-border">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Landmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Fill in the form and click "Predict" to see results
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