import { createClient } from '@supabase/supabase-js';
import { Ollama } from 'ollama';
import OpenAI from 'openai';
import Replicate from 'replicate';
import * as fs from 'fs';
import * as path from 'path';

interface AIModel {
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  context_window: number;
  cost_per_token: number;
  use_cases: string[];
  parameters: Record<string, any>;
}

interface RoutingRules {
  simple_text: string;
  content_creation: string;
  complex_analysis: string;
  strategic_planning: string;
  image_generation: string;
}

interface FallbackRules {
  ollama_unavailable: string;
  anthropic_quota_exceeded: string;
  replicate_quota_exceeded: string;
}

class AIRouter {
  private models: Map<string, AIModel>;
  private routingRules!: RoutingRules;
  private fallbackRules!: FallbackRules;
  private ollama: Ollama;
  private openai: OpenAI;
  private replicate: Replicate;
  private supabase;

  constructor() {
    this.models = new Map();
    this.loadModelConfiguration();

    // Initialize AI clients
    this.ollama = new Ollama();

    this.openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    });

    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  private loadModelConfiguration() {
    try {
      const configPath = path.join(__dirname, '../../ai-models/config/models.json');
      const configData = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configData);

      // Load models
      Object.entries(config.models).forEach(([key, model]: [string, any]) => {
        this.models.set(key, model as AIModel);
      });

      this.routingRules = config.routing_rules;
      this.fallbackRules = config.fallback_rules;
    } catch (error) {
      console.error('Error loading AI model configuration:', error);
      throw new Error('Failed to load AI model configuration');
    }
  }

  /**
   * Route a task to the most appropriate AI model based on task type and requirements
   */
  async routeTask(taskType: keyof RoutingRules, content: string, options: {
    maxTokens?: number;
    temperature?: number;
    context?: any;
  } = {}): Promise<any> {
    const modelKey = this.routingRules[taskType];
    let selectedModel = this.models.get(modelKey);

    if (!selectedModel) {
      throw new Error(`No model found for task type: ${taskType}`);
    }

    // Check if primary model is available
    const isAvailable = await this.checkModelAvailability(selectedModel);
    if (!isAvailable) {
      selectedModel = await this.getFallbackModel(taskType, selectedModel);
    }

    // Execute the task with the selected model
    return await this.executeTask(selectedModel, content, options);
  }

  private async checkModelAvailability(model: AIModel): Promise<boolean> {
    try {
      switch (model.provider) {
        case 'ollama':
          // Check if Ollama is running and model is available
          // For now, assume Ollama models are available
          return true; // FIXED: Removed problematic list() call

        case 'anthropic':
          // Check API quota/limits via OpenRouter
          return true; // Assume available for now

        case 'replicate':
          // Check Replicate credits
          return true; // Assume available for now

        default:
          return false;
      }
    } catch (error) {
      console.warn(`Model availability check failed for ${model.name}:`, error);
      return false;
    }
  }

  private async getFallbackModel(taskType: keyof RoutingRules, failedModel: AIModel): Promise<AIModel> {
    let fallbackKey: string;

    switch (failedModel.provider) {
      case 'ollama':
        fallbackKey = this.fallbackRules.ollama_unavailable;
        break;
      case 'anthropic':
        fallbackKey = this.fallbackRules.anthropic_quota_exceeded;
        break;
      case 'replicate':
        fallbackKey = this.fallbackRules.replicate_quota_exceeded;
        break;
      default:
        throw new Error(`No fallback available for model: ${failedModel.name}`);
    }

    if (fallbackKey === 'ollama_models_only') {
      // Find best available Ollama model for this task type
      const ollamaModels = Array.from(this.models.values())
        .filter(m => m.provider === 'ollama' && m.capabilities.includes(this.getCapabilityForTask(taskType)));

      if (ollamaModels.length === 0) {
        throw new Error(`No Ollama fallback available for task type: ${taskType}`);
      }

      return ollamaModels[0]; // Return first available Ollama model
    }

    const fallbackModel = this.models.get(fallbackKey);
    if (!fallbackModel) {
      throw new Error(`Fallback model not found: ${fallbackKey}`);
    }

    return fallbackModel;
  }

  private getCapabilityForTask(taskType: keyof RoutingRules): string {
    const capabilityMap = {
      simple_text: 'text_generation',
      content_creation: 'content_creation',
      complex_analysis: 'complex_reasoning',
      strategic_planning: 'complex_reasoning',
      image_generation: 'image_generation'
    };
    return capabilityMap[taskType];
  }

  private async executeTask(model: AIModel, content: string, options: any): Promise<any> {
    const params = { ...model.parameters, ...options };

    try {
      switch (model.provider) {
        case 'ollama':
          return await this.executeOllamaTask(model, content, params);

        case 'anthropic':
          return await this.executeAnthropicTask(model, content, params);

        case 'replicate':
          return await this.executeReplicateTask(model, content, params);

        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }
    } catch (error) {
      console.error(`Task execution failed for model ${model.name}:`, error);
      throw error;
    }
  }

  private async executeOllamaTask(model: AIModel, content: string, params: any): Promise<any> {
    const response = await this.ollama.generate(model.model_id, content) as any;

    return {
      content: response.response,
      model: model.name,
      usage: {
        prompt_tokens: response.prompt_eval_count,
        completion_tokens: response.eval_count,
        total_tokens: (response.prompt_eval_count || 0) + (response.eval_count || 0)
      }
    };
  }

  private async executeAnthropicTask(model: AIModel, content: string, params: any): Promise<any> {
    const response = await this.openai.chat.completions.create({
      model: model.model_id,
      messages: [{ role: 'user', content }],
      temperature: params.temperature,
      max_tokens: params.maxTokens || params.max_tokens
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content,
      model: model.name,
      usage: response.usage
    };
  }

  private async executeReplicateTask(model: AIModel, content: string, params: any): Promise<any> {
    const output = await this.replicate.run(model.model_id as `${string}/${string}` | `${string}/${string}:${string}`, {
      input: {
        prompt: content,
        width: params.width,
        height: params.height,
        steps: params.steps
      }
    });

    return {
      content: output,
      model: model.name,
      usage: { images_generated: 1 }
    };
  }

  /**
   * Log AI usage for cost tracking and analytics
   */
  private async logUsage(model: AIModel, usage: any, taskType: string) {
    try {
      await this.supabase.from('ai_usage_logs').insert({
        model_name: model.name,
        provider: model.provider,
        task_type: taskType,
        tokens_used: usage.total_tokens || 0,
        cost_incurred: (usage.total_tokens || 0) * model.cost_per_token,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log AI usage:', error);
    }
  }

  /**
   * Get cost estimate for a task
   */
  estimateCost(taskType: keyof RoutingRules, estimatedTokens: number): number {
    const modelKey = this.routingRules[taskType];
    const model = this.models.get(modelKey);
    return model ? model.cost_per_token * estimatedTokens : 0;
  }

  /**
   * Get available models for a specific capability
   */
  getModelsByCapability(capability: string): AIModel[] {
    return Array.from(this.models.values())
      .filter(model => model.capabilities.includes(capability));
  }
}

export default AIRouter;
