// API Service Layer for ML Backend Integration
// Configure BASE_URL to point to your deployed FastAPI backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// ============ Spam Classification ============
export interface SpamPrediction {
  label: 'Spam' | 'Not Spam';
  confidence: number;
}

export async function predictSpam(message: string): Promise<ApiResponse<SpamPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  const isSpam = message.toLowerCase().includes('free') || 
                 message.toLowerCase().includes('winner') ||
                 message.toLowerCase().includes('click here');
  return {
    success: true,
    data: {
      label: isSpam ? 'Spam' : 'Not Spam',
      confidence: isSpam ? 0.89 : 0.94,
    },
  };
  
  // Uncomment for real API:
  // return fetchApi<SpamPrediction>('/predict/spam', {
  //   method: 'POST',
  //   body: JSON.stringify({ message }),
  // });
}

// ============ Sentiment Analysis ============
export interface SentimentPrediction {
  sentiment: 'Positive' | 'Negative';
  confidence: number;
}

export async function predictSentiment(review: string): Promise<ApiResponse<SentimentPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1200));
  const positiveWords = ['great', 'amazing', 'excellent', 'love', 'wonderful', 'best'];
  const isPositive = positiveWords.some(word => review.toLowerCase().includes(word));
  return {
    success: true,
    data: {
      sentiment: isPositive ? 'Positive' : 'Negative',
      confidence: isPositive ? 0.92 : 0.87,
    },
  };
}

// ============ Loan Approval ============
// Backend API Contract - POST /predict/loan
export interface LoanInput {
  person_age: number;
  person_gender: 'Male' | 'Female';
  person_education: 'High School' | 'Bachelor' | 'Master' | 'Doctorate';
  person_income: number;
  person_emp_exp: number;
  person_home_ownership: 'RENT' | 'OWN' | 'MORTGAGE' | 'OTHER';
  loan_amnt: number;
  loan_intent: 'PERSONAL' | 'EDUCATION' | 'MEDICAL' | 'VENTURE' | 'HOMEIMPROVEMENT' | 'DEBTCONSOLIDATION';
  loan_int_rate: number;
  loan_percent_income: number;
  cb_person_cred_hist_length: number;
  credit_score: number;
  previous_loan_defaults_on_file: 'Yes' | 'No';
}

export interface LoanPrediction {
  approved: boolean;
  confidence: number;
}

export async function predictLoanApproval(input: LoanInput): Promise<ApiResponse<LoanPrediction>> {
  return fetchApi<LoanPrediction>('/predict/loan', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============ Butterfly Classification ============
// Backend API Contract - POST /predict/butterfly (multipart/form-data)
export interface ButterflyPrediction {
  species: string;
  confidence: number;
}

export async function predictButterfly(imageFile: File): Promise<ApiResponse<ButterflyPrediction>> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${BASE_URL}/predict/butterfly`, {
      method: 'POST',
      body: formData,
      // Note: Do NOT set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// ============ Galaxy Regression ============
// Backend API Contract - POST /predict/galaxy
export interface GalaxyInput {
  obj_ID: number;
  alpha: number;
  delta: number;
  u: number;
  g: number;
  r: number;
  i: number;
  z: number;
  run_ID: number;
  rerun_ID: number;
  cam_col: number;
  field_ID: number;
  spec_obj_ID: number;
  redshift: number;
  plate: number;
  MJD: number;
  fiber_ID: number;
}

export interface GalaxyPrediction {
  predictedValue: number;
  unit: string;
}

export async function predictGalaxy(input: GalaxyInput): Promise<ApiResponse<GalaxyPrediction>> {
  return fetchApi<GalaxyPrediction>('/predict/galaxy', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============ Fish Clustering ============
// Backend API Contract - POST /predict/fish
export interface FishInput {
  length: number;
  weight: number;
  w_l_ratio: number;
}

export interface FishPrediction {
  cluster_id: number;
  cluster_label: string;
}

export async function predictFishCluster(input: FishInput): Promise<ApiResponse<FishPrediction>> {
  return fetchApi<FishPrediction>('/predict/fish', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// ============ GDP Data (Frontend Only - No Backend) ============
export interface GDPData {
  year: number;
  gdp: number;
}

export interface GDPResponse {
  country: string;
  data: GDPData[];
  stats: {
    average: number;
    min: number;
    max: number;
    growth: number;
  };
}

export async function getGDPData(country: string, startYear?: number, endYear?: number): Promise<ApiResponse<GDPResponse>> {
  // Frontend-only mock data - no backend required
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const years = Array.from({ length: 20 }, (_, i) => 2004 + i);
  const baseGDP = country === 'United States' ? 15000 : 
                  country === 'China' ? 5000 :
                  country === 'India' ? 1500 :
                  country === 'Germany' ? 4000 : 2000;
  
  const data = years.map((year, idx) => ({
    year,
    gdp: baseGDP + (idx * baseGDP * 0.05) + (Math.random() * baseGDP * 0.1),
  }));

  const gdpValues = data.map(d => d.gdp);
  
  return {
    success: true,
    data: {
      country,
      data,
      stats: {
        average: gdpValues.reduce((a, b) => a + b, 0) / gdpValues.length,
        min: Math.min(...gdpValues),
        max: Math.max(...gdpValues),
        growth: ((gdpValues[gdpValues.length - 1] - gdpValues[0]) / gdpValues[0]) * 100,
      },
    },
  };
}
