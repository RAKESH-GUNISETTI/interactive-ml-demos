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
      throw new Error(`HTTP error! status: ${response.status}`);
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
export interface LoanInput {
  applicantIncome: number;
  coapplicantIncome: number;
  loanAmount: number;
  loanAmountTerm: number;
  creditHistory: 0 | 1;
  gender: 'Male' | 'Female';
  married: 'Yes' | 'No';
  education: 'Graduate' | 'Not Graduate';
  selfEmployed: 'Yes' | 'No';
  propertyArea: 'Urban' | 'Semiurban' | 'Rural';
}

export interface LoanPrediction {
  approved: boolean;
  confidence: number;
}

export async function predictLoanApproval(input: LoanInput): Promise<ApiResponse<LoanPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1100));
  const score = (input.creditHistory === 1 ? 40 : 0) +
                (input.applicantIncome > 5000 ? 20 : 10) +
                (input.education === 'Graduate' ? 15 : 5) +
                (input.propertyArea === 'Urban' ? 10 : 5) +
                (input.married === 'Yes' ? 10 : 5);
  const approved = score > 60;
  return {
    success: true,
    data: {
      approved,
      confidence: approved ? 0.85 + Math.random() * 0.1 : 0.75 + Math.random() * 0.15,
    },
  };
}

// ============ Butterfly Classification ============
export interface ButterflyPrediction {
  species: string;
  confidence: number;
}

const butterflySpecies = [
  'Monarch Butterfly',
  'Painted Lady',
  'Red Admiral',
  'Common Buckeye',
  'Swallowtail',
  'Blue Morpho',
  'Peacock Butterfly',
];

export async function predictButterfly(imageFile: File): Promise<ApiResponse<ButterflyPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1500));
  const randomSpecies = butterflySpecies[Math.floor(Math.random() * butterflySpecies.length)];
  return {
    success: true,
    data: {
      species: randomSpecies,
      confidence: 0.82 + Math.random() * 0.15,
    },
  };
  
  // Uncomment for real API:
  // const formData = new FormData();
  // formData.append('image', imageFile);
  // return fetch(`${BASE_URL}/predict/butterfly`, {
  //   method: 'POST',
  //   body: formData,
  // }).then(res => res.json());
}

// ============ Galaxy Regression ============
export interface GalaxyInput {
  ra: number;
  dec: number;
  u: number;
  g: number;
  r: number;
  i: number;
  z: number;
  redshift: number;
}

export interface GalaxyPrediction {
  predictedValue: number;
  unit: string;
}

export async function predictGalaxy(input: GalaxyInput): Promise<ApiResponse<GalaxyPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1000));
  const predictedValue = (input.redshift * 1000 + input.u * 10 + input.g * 5) / 100;
  return {
    success: true,
    data: {
      predictedValue: parseFloat(predictedValue.toFixed(4)),
      unit: 'Magnitude',
    },
  };
}

// ============ Fish Clustering ============
export interface FishInput {
  weight: number;
  length1: number;
  length2: number;
  length3: number;
  height: number;
  width: number;
}

export interface FishPrediction {
  cluster: number;
  clusterName: string;
  description: string;
}

const fishClusters = [
  { name: 'Small Fish', description: 'Characterized by lower weight and shorter lengths' },
  { name: 'Medium Fish', description: 'Average-sized fish with balanced proportions' },
  { name: 'Large Fish', description: 'Higher weight and longer body dimensions' },
];

export async function predictFishCluster(input: FishInput): Promise<ApiResponse<FishPrediction>> {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 900));
  const avgSize = (input.weight + input.length1 + input.length2) / 3;
  const clusterIdx = avgSize < 200 ? 0 : avgSize < 500 ? 1 : 2;
  return {
    success: true,
    data: {
      cluster: clusterIdx,
      clusterName: fishClusters[clusterIdx].name,
      description: fishClusters[clusterIdx].description,
    },
  };
}

// ============ GDP Data ============
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
  // Mock response for development
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