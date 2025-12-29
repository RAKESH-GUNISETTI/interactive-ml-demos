import { pipeline } from "@huggingface/transformers";

// Cache for loaded pipelines
const pipelineCache: Record<string, any> = {};

// Loading status tracker
const loadingStatus: Record<string, boolean> = {};

export type ModelStatus = "idle" | "loading" | "ready" | "error";

interface PredictionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Get or create a pipeline with caching
async function getOrCreatePipeline(
  task: string,
  model: string,
  onProgress?: (progress: number) => void
): Promise<any> {
  const cacheKey = `${task}:${model}`;
  
  if (pipelineCache[cacheKey]) {
    return pipelineCache[cacheKey];
  }

  if (loadingStatus[cacheKey]) {
    // Wait for existing load to complete
    while (loadingStatus[cacheKey]) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pipelineCache[cacheKey];
  }

  loadingStatus[cacheKey] = true;

  try {
    const pipe = await pipeline(task as any, model, {
      progress_callback: (progressData: any) => {
        if (onProgress && progressData.progress) {
          onProgress(progressData.progress);
        }
      },
    });
    
    pipelineCache[cacheKey] = pipe;
    return pipe;
  } finally {
    loadingStatus[cacheKey] = false;
  }
}

// ============ Text Classification (Spam/Sentiment) ============
export interface TextClassificationResult {
  label: string;
  score: number;
}

export async function classifyText(
  text: string,
  onProgress?: (progress: number) => void
): Promise<PredictionResult<TextClassificationResult>> {
  try {
    const classifier = await getOrCreatePipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      onProgress
    );

    const result = await classifier(text);
    const output = Array.isArray(result) ? result[0] : result;

    return {
      success: true,
      data: {
        label: output.label,
        score: output.score,
      },
    };
  } catch (error) {
    console.error("Text classification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Classification failed",
    };
  }
}

// ============ Sentiment Analysis ============
export async function analyzeSentiment(
  text: string,
  onProgress?: (progress: number) => void
): Promise<PredictionResult<{ sentiment: "Positive" | "Negative"; confidence: number }>> {
  try {
    const result = await classifyText(text, onProgress);
    
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      data: {
        sentiment: result.data.label === "POSITIVE" ? "Positive" : "Negative",
        confidence: result.data.score,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sentiment analysis failed",
    };
  }
}

// ============ Spam Detection (uses sentiment model as proxy) ============
export async function detectSpam(
  message: string,
  onProgress?: (progress: number) => void
): Promise<PredictionResult<{ label: "Spam" | "Not Spam"; confidence: number }>> {
  try {
    // Use heuristics combined with sentiment for spam detection
    const spamKeywords = [
      "free", "winner", "click here", "congratulations", "urgent",
      "act now", "limited time", "buy now", "discount", "offer expires",
      "no cost", "risk free", "guaranteed", "prize", "cash",
    ];
    
    const lowerMessage = message.toLowerCase();
    const spamScore = spamKeywords.filter(kw => lowerMessage.includes(kw)).length;
    const hasExcessiveCaps = (message.match(/[A-Z]/g)?.length || 0) > message.length * 0.5;
    const hasExcessivePunctuation = (message.match(/[!?]/g)?.length || 0) > 3;

    // Calculate spam probability
    let spamProbability = Math.min(spamScore * 0.15, 0.6);
    if (hasExcessiveCaps) spamProbability += 0.2;
    if (hasExcessivePunctuation) spamProbability += 0.15;

    // Also use sentiment - negative sentiment with spam keywords is more likely spam
    const sentimentResult = await analyzeSentiment(message, onProgress);
    if (sentimentResult.success && sentimentResult.data?.sentiment === "Negative") {
      spamProbability += 0.1;
    }

    const isSpam = spamProbability > 0.4;
    const confidence = isSpam ? Math.min(0.5 + spamProbability, 0.98) : Math.max(0.6, 1 - spamProbability);

    return {
      success: true,
      data: {
        label: isSpam ? "Spam" : "Not Spam",
        confidence,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Spam detection failed",
    };
  }
}

// ============ Image Classification ============
export interface ImageClassificationResult {
  label: string;
  score: number;
}

export async function classifyImage(
  imageUrl: string,
  onProgress?: (progress: number) => void
): Promise<PredictionResult<ImageClassificationResult[]>> {
  try {
    const classifier = await getOrCreatePipeline(
      "image-classification",
      "Xenova/vit-base-patch16-224",
      onProgress
    );

    const result = await classifier(imageUrl);
    const outputs = Array.isArray(result) ? result : [result];

    return {
      success: true,
      data: outputs.slice(0, 5).map((item: any) => ({
        label: item.label,
        score: item.score,
      })),
    };
  } catch (error) {
    console.error("Image classification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Image classification failed",
    };
  }
}

// ============ Zero-Shot Classification ============
export async function zeroShotClassify(
  text: string,
  labels: string[],
  onProgress?: (progress: number) => void
): Promise<PredictionResult<{ labels: string[]; scores: number[] }>> {
  try {
    const classifier = await getOrCreatePipeline(
      "zero-shot-classification",
      "Xenova/mobilebert-uncased-mnli",
      onProgress
    );

    const result = await classifier(text, labels);
    
    return {
      success: true,
      data: {
        labels: result.labels,
        scores: result.scores,
      },
    };
  } catch (error) {
    console.error("Zero-shot classification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Classification failed",
    };
  }
}

// ============ Feature Extraction (Embeddings) ============
export async function getEmbeddings(
  text: string,
  onProgress?: (progress: number) => void
): Promise<PredictionResult<number[]>> {
  try {
    const extractor = await getOrCreatePipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      onProgress
    );

    const result = await extractor(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(result.data);

    return {
      success: true,
      data: embedding as number[],
    };
  } catch (error) {
    console.error("Embedding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Embedding extraction failed",
    };
  }
}

// Helper to check if WebGPU is available
export function isWebGPUAvailable(): boolean {
  return "gpu" in navigator;
}

// Get model loading status
export function getModelStatus(task: string, model: string): ModelStatus {
  const cacheKey = `${task}:${model}`;
  if (pipelineCache[cacheKey]) return "ready";
  if (loadingStatus[cacheKey]) return "loading";
  return "idle";
}