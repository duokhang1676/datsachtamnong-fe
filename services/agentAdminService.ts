import axios from "axios";

const AGENT_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:4000/api";

const agentApi = axios.create({
  baseURL: AGENT_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export type AgentRunStatus = "queued" | "running" | "success" | "failed";

export interface AgentRunLog {
  at: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface AgentRunRecord {
  id: string;
  reason: "cron" | "startup" | "manual";
  status: AgentRunStatus;
  queuedAt: string;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  title?: string;
  error?: string;
  resultMeta?: {
    keyword?: string;
    categoryName?: string;
    tags?: string[];
    wordCount?: number;
    imageCount?: number;
  };
  logs: AgentRunLog[];
}

export interface AgentDashboardOverview {
  online: boolean;
  isRunning: boolean;
  queuedJobs: number;
  totalRuns: number;
  byStatus: {
    queued: number;
    running: number;
    success: number;
    failed: number;
  };
  latestRun: AgentRunRecord | null;
  cronEnabled: boolean;
  cronExpression: string;
  timezone: string;
  runOnStartup: boolean;
  uptimeSeconds: number;
  successRate: number;
  failureRate: number;
  performance: {
    avgDurationMs: number;
    p95DurationMs: number;
    last24hRuns: number;
    last24hSuccess: number;
    last24hFailed: number;
  };
  contentInsights: {
    totalPublished: number;
    avgWordCount: number;
    avgTagsPerArticle: number;
    topKeywords: Array<{ label: string; count: number }>;
    topCategories: Array<{ label: string; count: number }>;
    topTags: Array<{ label: string; count: number }>;
    recentPublished: Array<{
      id: string;
      title: string;
      keyword: string;
      categoryName: string;
      publishedAt: string;
    }>;
  };
  imageInsights: {
    totalImages: number;
    avgImagesPerArticle: number;
    noImageArticles: number;
    withImageArticles: number;
    coverageRate: number;
  };
  recentFailures: Array<{
    id: string;
    at: string;
    reason: "cron" | "startup" | "manual";
    error: string;
  }>;
}

export interface SchedulerConfig {
  cronEnabled: boolean;
  cronExpression: string;
  timezone: string;
  runOnStartup: boolean;
  nextRunTimes: string[];
}

export interface ValidationError {
  success: false;
  error: string;
}

export interface ValidationSuccess {
  success: true;
  data: {
    nextRunTimes: string[];
  };
}

export interface SchedulerConfigUpdatePayload {
  expression?: string;
  timezone?: string;
  enabled?: boolean;
  runOnStartup?: boolean;
}

export interface AgentContextConfig {
  llm: {
    contentModel: string;
    contentTemperature: number;
    topicModel: string;
    topicTemperature: number;
    seoModel: string;
    seoTemperature: number;
    imagePlannerModel: string;
    imagePlannerTemperature: number;
  };
  content: {
    systemRolePrompt: string;
    styleProfiles: string[];
    mandatoryRequirements: string[];
  };
  workflow: {
    styleBlueprints: string[];
    templateVariations: string[];
  };
  topic: {
    strategyPrompt: string;
    topicsPerRun: number;
    requiredIntents: string[];
    requiredFormats: string[];
  };
  seo: {
    systemPrompt: string;
    metadataInstruction: string;
    jsonSchemaLines: string[];
    rules: string[];
  };
  image: {
    minInlineImages: number;
    maxInlineImages: number;
    defaultFallbackQuery: string;
    plannerPromptAddon: string;
    providerOrder: Array<"pexels" | "fallback">;
    keywordRules: Array<{ pattern: string; keyword: string }>;
    tokenTranslationMap: Record<string, string>;
    pexels: {
      endpoint: string;
      perPage: number;
      orientation: "landscape" | "portrait" | "square";
      size: "small" | "medium" | "large";
      timeoutMs: number;
    };
  };
}

export const getAgentDashboard = async (): Promise<AgentDashboardOverview> => {
  const response = await agentApi.get("/agent-admin/dashboard");
  return response.data?.data as AgentDashboardOverview;
};

export const getAgentRuns = async (params?: { limit?: number; status?: AgentRunStatus | "all" }): Promise<AgentRunRecord[]> => {
  const query: Record<string, string | number> = {};

  if (params?.limit) {
    query.limit = params.limit;
  }

  if (params?.status && params.status !== "all") {
    query.status = params.status;
  }

  const response = await agentApi.get("/agent-admin/runs", {
    params: query
  });

  return Array.isArray(response.data?.data) ? response.data.data as AgentRunRecord[] : [];
};

export const triggerAgentRun = async (): Promise<void> => {
  await agentApi.post("/agent-admin/runs/trigger");
};

export const getSchedulerConfig = async (): Promise<SchedulerConfig> => {
  const response = await agentApi.get("/agent-admin/config");
  return response.data?.data as SchedulerConfig;
};

export const validateSchedulerConfig = async (
  expression?: string,
  timezone?: string
): Promise<ValidationSuccess | ValidationError> => {
  try {
    const payload: Record<string, string> = {};
    if (expression !== undefined) payload.expression = expression;
    if (timezone !== undefined) payload.timezone = timezone;

    const response = await agentApi.post("/agent-admin/config/validate", payload);
    return {
      success: true,
      data: {
        nextRunTimes: Array.isArray(response.data?.data?.nextRunTimes)
          ? response.data.data.nextRunTimes as string[]
          : []
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message || "Validation failed"
    };
  }
};

export const updateSchedulerConfig = async (
  payload: SchedulerConfigUpdatePayload
): Promise<{ success: true; data: SchedulerConfig } | ValidationError> => {
  try {
    const response = await agentApi.put("/agent-admin/config", payload);
    return {
      success: true as const,
      data: response.data?.data as SchedulerConfig
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message || "Update failed"
    };
  }
};

export const getAgentContextConfig = async (): Promise<AgentContextConfig> => {
  const response = await agentApi.get("/agent-admin/context");
  return response.data?.data as AgentContextConfig;
};

export const updateAgentContextConfig = async (
  payload: Partial<AgentContextConfig>
): Promise<{ success: true; data: AgentContextConfig } | ValidationError> => {
  try {
    const response = await agentApi.put("/agent-admin/context", payload);
    return {
      success: true,
      data: response.data?.data as AgentContextConfig
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message || "Update failed"
    };
  }
};

export const resetAgentContextConfig = async (): Promise<AgentContextConfig> => {
  const response = await agentApi.post("/agent-admin/context/reset");
  return response.data?.data as AgentContextConfig;
};
