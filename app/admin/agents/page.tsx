"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Clock3, Download, Edit2, Image as ImageIcon, PlayCircle, RefreshCcw, Search, ShieldCheck, ShieldX, Timer, X } from "lucide-react";

import {
  getAgentDashboard,
  getAgentRuns,
  triggerAgentRun,
  getSchedulerConfig,
  validateSchedulerConfig,
  updateSchedulerConfig,
  getAgentContextConfig,
  updateAgentContextConfig,
  resetAgentContextConfig,
  type AgentDashboardOverview,
  type AgentRunRecord,
  type AgentRunStatus,
  type SchedulerConfig,
  type AgentContextConfig
} from "@/services/agentAdminService";

type LoadState = "idle" | "loading" | "error";
type ScheduleType = "daily" | "weekdays" | "weeklySunday" | "monthlyFirst" | "every4Hours" | "every6Hours" | "every12Hours";

const SCHEDULE_OPTIONS: Array<{ value: ScheduleType; label: string }> = [
  { value: "daily", label: "Mỗi ngày" },
  { value: "weekdays", label: "Thứ 2 - Thứ 6" },
  { value: "weeklySunday", label: "Mỗi Chủ nhật" },
  { value: "monthlyFirst", label: "Ngày 1 mỗi tháng" },
  { value: "every4Hours", label: "Nhiều lần/ngày - mỗi 4 giờ" },
  { value: "every6Hours", label: "Nhiều lần/ngày - mỗi 6 giờ" },
  { value: "every12Hours", label: "Nhiều lần/ngày - mỗi 12 giờ" }
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const label = `${String(hour).padStart(2, "0")}:00`;
  return { value: label, label };
});

const TIMEZONE_OPTIONS = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "UTC",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles"
];

const listToText = (items: string[]): string => items.join("\n");

const textToList = (value: string): string[] => value
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

const keywordRulesToText = (items: Array<{ pattern: string; keyword: string }>): string => {
  return items.map((item) => `${item.pattern} => ${item.keyword}`).join("\n");
};

const textToKeywordRules = (value: string): Array<{ pattern: string; keyword: string }> => {
  return textToList(value)
    .map((line) => {
      const splitIndex = line.indexOf("=>");
      if (splitIndex < 0) {
        return null;
      }

      const pattern = line.slice(0, splitIndex).trim();
      const keyword = line.slice(splitIndex + 2).trim();
      if (!pattern || !keyword) {
        return null;
      }

      return { pattern, keyword };
    })
    .filter((item): item is { pattern: string; keyword: string } => item !== null);
};

const tokenMapToText = (value: Record<string, string>): string => {
  return Object.entries(value).map(([key, mapped]) => `${key}=${mapped}`).join("\n");
};

const textToTokenMap = (value: string): Record<string, string> => {
  const entries = textToList(value)
    .map((line) => {
      const splitIndex = line.indexOf("=");
      if (splitIndex < 0) {
        return null;
      }

      const key = line.slice(0, splitIndex).trim();
      const mapped = line.slice(splitIndex + 1).trim();
      if (!key || !mapped) {
        return null;
      }

      return [key, mapped] as const;
    })
    .filter((item): item is readonly [string, string] => item !== null);

  return Object.fromEntries(entries);
};

const formatDateTime = (value?: string): string => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("vi-VN");
};

const formatDuration = (durationMs?: number): string => {
  if (typeof durationMs !== "number" || Number.isNaN(durationMs)) {
    return "-";
  }

  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  return `${(durationMs / 1000).toFixed(1)}s`;
};

const statusBadgeClass: Record<AgentRunStatus, string> = {
  queued: "bg-amber-100 text-amber-800",
  running: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800"
};

const parseCronToUi = (expression: string): { scheduleType: ScheduleType; time: string; isCustom: boolean } => {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { scheduleType: "daily", time: "09:00", isCustom: true };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const minuteNum = Number(minute);
  const hourNum = Number(hour);
  const isBasicTime = Number.isInteger(minuteNum) && Number.isInteger(hourNum) && minuteNum >= 0 && minuteNum <= 59 && hourNum >= 0 && hourNum <= 23;

  if (!isBasicTime) {
    return { scheduleType: "daily", time: "09:00", isCustom: true };
  }

  const time = `${String(hourNum).padStart(2, "0")}:${String(minuteNum).padStart(2, "0")}`;

  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
    return { scheduleType: "daily", time, isCustom: false };
  }

  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "1-5") {
    return { scheduleType: "weekdays", time, isCustom: false };
  }

  if (dayOfMonth === "*" && month === "*" && (dayOfWeek === "0" || dayOfWeek === "7")) {
    return { scheduleType: "weeklySunday", time, isCustom: false };
  }

  if (dayOfMonth === "1" && month === "*" && dayOfWeek === "*") {
    return { scheduleType: "monthlyFirst", time, isCustom: false };
  }

  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*" && hour === "*/4") {
    return { scheduleType: "every4Hours", time, isCustom: false };
  }

  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*" && hour === "*/6") {
    return { scheduleType: "every6Hours", time, isCustom: false };
  }

  if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*" && hour === "*/12") {
    return { scheduleType: "every12Hours", time, isCustom: false };
  }

  return { scheduleType: "daily", time, isCustom: true };
};

const buildCronFromUi = (scheduleType: ScheduleType, time: string): string => {
  const [hourRaw, minuteRaw] = time.split(":");
  const hour = Number.isInteger(Number(hourRaw)) ? Number(hourRaw) : 9;
  const minute = Number.isInteger(Number(minuteRaw)) ? Number(minuteRaw) : 0;

  if (scheduleType === "weekdays") {
    return `${minute} ${hour} * * 1-5`;
  }

  if (scheduleType === "weeklySunday") {
    return `${minute} ${hour} * * 0`;
  }

  if (scheduleType === "monthlyFirst") {
    return `${minute} ${hour} 1 * *`;
  }

  if (scheduleType === "every4Hours") {
    return `${minute} */4 * * *`;
  }

  if (scheduleType === "every6Hours") {
    return `${minute} */6 * * *`;
  }

  if (scheduleType === "every12Hours") {
    return `${minute} */12 * * *`;
  }

  return `${minute} ${hour} * * *`;
};

const formatNaturalSchedule = (scheduleType: ScheduleType, time: string): string => {
  if (scheduleType === "weekdays") {
    return `Mỗi ngày từ Thứ 2 đến Thứ 6 lúc ${time}`;
  }

  if (scheduleType === "weeklySunday") {
    return `Mỗi Chủ nhật lúc ${time}`;
  }

  if (scheduleType === "monthlyFirst") {
    return `Ngày 1 mỗi tháng lúc ${time}`;
  }

  if (scheduleType === "every4Hours") {
    return `Mỗi 4 giờ (mốc phút ${time.slice(3, 5)})`;
  }

  if (scheduleType === "every6Hours") {
    return `Mỗi 6 giờ (mốc phút ${time.slice(3, 5)})`;
  }

  if (scheduleType === "every12Hours") {
    return `Mỗi 12 giờ (mốc phút ${time.slice(3, 5)})`;
  }

  return `Mỗi ngày lúc ${time}`;
};

const formatNaturalFromCron = (expression: string): string => {
  const parsed = parseCronToUi(expression);
  if (parsed.isCustom) {
    return `Lịch tùy chỉnh (${expression})`;
  }

  return formatNaturalSchedule(parsed.scheduleType, parsed.time);
};

export default function AdminAgentsPage() {
  const [state, setState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dashboard, setDashboard] = useState<AgentDashboardOverview | null>(null);
  const [runs, setRuns] = useState<AgentRunRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | AgentRunStatus>("all");
  const [searchText, setSearchText] = useState("");
  const [isTriggering, setIsTriggering] = useState(false);

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [schedulerConfig, setSchedulerConfig] = useState<SchedulerConfig | null>(null);
  const [formScheduleType, setFormScheduleType] = useState<ScheduleType>("daily");
  const [formScheduleTime, setFormScheduleTime] = useState("09:00");
  const [formTimezone, setFormTimezone] = useState("");
  const [formCronEnabled, setFormCronEnabled] = useState(true);
  const [formRunOnStartup, setFormRunOnStartup] = useState(false);
  const [configError, setConfigError] = useState("");
  const [configSuccess, setConfigSuccess] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nextRunTimes, setNextRunTimes] = useState<string[]>([]);
  const [contextConfig, setContextConfig] = useState<AgentContextConfig | null>(null);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [contextError, setContextError] = useState("");
  const [contextSuccess, setContextSuccess] = useState("");

  const [contentModel, setContentModel] = useState("");
  const [contentTemperature, setContentTemperature] = useState(0.7);
  const [topicModel, setTopicModel] = useState("");
  const [topicTemperature, setTopicTemperature] = useState(0.7);
  const [seoModel, setSeoModel] = useState("");
  const [seoTemperature, setSeoTemperature] = useState(0.4);
  const [imagePlannerModel, setImagePlannerModel] = useState("");
  const [imagePlannerTemperature, setImagePlannerTemperature] = useState(0.25);

  const [contentRolePrompt, setContentRolePrompt] = useState("");
  const [contentStyleProfilesText, setContentStyleProfilesText] = useState("");
  const [contentRequirementsText, setContentRequirementsText] = useState("");

  const [workflowStylesText, setWorkflowStylesText] = useState("");
  const [workflowTemplatesText, setWorkflowTemplatesText] = useState("");

  const [topicSystemPrompt, setTopicSystemPrompt] = useState("");
  const [topicPerRun, setTopicPerRun] = useState(5);
  const [topicIntentsText, setTopicIntentsText] = useState("");
  const [topicFormatsText, setTopicFormatsText] = useState("");

  const [seoSystemPrompt, setSeoSystemPrompt] = useState("");
  const [seoMetadataInstruction, setSeoMetadataInstruction] = useState("");
  const [seoSchemaText, setSeoSchemaText] = useState("");
  const [seoRulesText, setSeoRulesText] = useState("");

  const [imageMin, setImageMin] = useState(1);
  const [imageMax, setImageMax] = useState(3);
  const [imageFallbackQuery, setImageFallbackQuery] = useState("");
  const [imagePromptAddon, setImagePromptAddon] = useState("");
  const [imageProviderOrderText, setImageProviderOrderText] = useState("");
  const [imageKeywordRulesText, setImageKeywordRulesText] = useState("");
  const [imageTokenMapText, setImageTokenMapText] = useState("");
  const [pexelsEndpoint, setPexelsEndpoint] = useState("");
  const [pexelsPerPage, setPexelsPerPage] = useState(12);
  const [pexelsOrientation, setPexelsOrientation] = useState<"landscape" | "portrait" | "square">("landscape");
  const [pexelsSize, setPexelsSize] = useState<"small" | "medium" | "large">("large");
  const [pexelsTimeoutMs, setPexelsTimeoutMs] = useState(9000);

  const loadData = async (status: "all" | AgentRunStatus = filterStatus) => {
    try {
      setState("loading");
      setErrorMessage("");

      const [overview, runRows] = await Promise.all([
        getAgentDashboard(),
        getAgentRuns({
          limit: 30,
          status
        })
      ]);

      setDashboard(overview);
      setRuns(runRows);
      setState("idle");
    } catch (error: any) {
      setState("error");
      setErrorMessage(error?.message || "Không thể tải dữ liệu agent.");
    }
  };

  const loadSchedulerConfig = async () => {
    try {
      const config = await getSchedulerConfig();
      setSchedulerConfig(config);
      setNextRunTimes(config.nextRunTimes || []);
    } catch (error: any) {
      console.error("Failed to load scheduler config:", error);
    }
  };

  const applyContextToForm = (config: AgentContextConfig) => {
    setContextConfig(config);
    setContentModel(config.llm.contentModel);
    setContentTemperature(config.llm.contentTemperature);
    setTopicModel(config.llm.topicModel);
    setTopicTemperature(config.llm.topicTemperature);
    setSeoModel(config.llm.seoModel);
    setSeoTemperature(config.llm.seoTemperature);
    setImagePlannerModel(config.llm.imagePlannerModel);
    setImagePlannerTemperature(config.llm.imagePlannerTemperature);

    setContentRolePrompt(config.content.systemRolePrompt);
    setContentStyleProfilesText(listToText(config.content.styleProfiles));
    setContentRequirementsText(listToText(config.content.mandatoryRequirements));

    setWorkflowStylesText(listToText(config.workflow.styleBlueprints));
    setWorkflowTemplatesText(listToText(config.workflow.templateVariations));

    setTopicSystemPrompt(config.topic.strategyPrompt);
    setTopicPerRun(config.topic.topicsPerRun);
    setTopicIntentsText(listToText(config.topic.requiredIntents));
    setTopicFormatsText(listToText(config.topic.requiredFormats));

    setSeoSystemPrompt(config.seo.systemPrompt);
    setSeoMetadataInstruction(config.seo.metadataInstruction);
    setSeoSchemaText(listToText(config.seo.jsonSchemaLines));
    setSeoRulesText(listToText(config.seo.rules));

    setImageMin(config.image.minInlineImages);
    setImageMax(config.image.maxInlineImages);
    setImageFallbackQuery(config.image.defaultFallbackQuery);
    setImagePromptAddon(config.image.plannerPromptAddon);
    setImageProviderOrderText(listToText(config.image.providerOrder));
    setImageKeywordRulesText(keywordRulesToText(config.image.keywordRules));
    setImageTokenMapText(tokenMapToText(config.image.tokenTranslationMap));
    setPexelsEndpoint(config.image.pexels.endpoint);
    setPexelsPerPage(config.image.pexels.perPage);
    setPexelsOrientation(config.image.pexels.orientation);
    setPexelsSize(config.image.pexels.size);
    setPexelsTimeoutMs(config.image.pexels.timeoutMs);
  };

  const loadContextConfig = async () => {
    try {
      const config = await getAgentContextConfig();
      applyContextToForm(config);
    } catch (error: any) {
      setContextError(error?.message || "Không thể tải agent context.");
    }
  };

  useEffect(() => {
    void loadData("all");
    void loadSchedulerConfig();
    void loadContextConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestLogs = useMemo(() => {
    const runWithLogs = runs.find((item) => Array.isArray(item.logs) && item.logs.length > 0);
    return runWithLogs?.logs?.slice(0, 12) ?? [];
  }, [runs]);

  const filteredRuns = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return runs;
    }

    return runs.filter((run) => {
      const haystack = [
        run.id,
        run.reason,
        run.status,
        run.title,
        run.error,
        run.resultMeta?.keyword,
        run.resultMeta?.categoryName
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [runs, searchText]);

  const handleFilterChange = async (next: "all" | AgentRunStatus) => {
    setFilterStatus(next);
    await loadData(next);
  };

  const handleTriggerNow = async () => {
    try {
      setIsTriggering(true);
      await triggerAgentRun();
      await loadData(filterStatus);
    } catch (error: any) {
      setErrorMessage(error?.message || "Không thể trigger workflow.");
    } finally {
      setIsTriggering(false);
    }
  };

  const handleEditConfig = () => {
    setConfigError("");
    setConfigSuccess("");
    if (schedulerConfig) {
      const parsed = parseCronToUi(schedulerConfig.cronExpression);
      setFormScheduleType(parsed.scheduleType);
      setFormScheduleTime(parsed.time);
      setFormTimezone(schedulerConfig.timezone);
      setFormCronEnabled(schedulerConfig.cronEnabled);
      setFormRunOnStartup(schedulerConfig.runOnStartup);

      if (parsed.isCustom) {
        setConfigError("Lịch cron hiện tại là dạng tùy chỉnh. Khi lưu từ giao diện này, hệ thống sẽ chuyển sang lịch theo mẫu đã chọn.");
      }
    }
    setIsEditingConfig(true);
  };

  const handleCancelEdit = () => {
    setIsEditingConfig(false);
    setFormScheduleType("daily");
    setFormScheduleTime("09:00");
    setFormTimezone("");
    setFormCronEnabled(true);
    setFormRunOnStartup(false);
    setConfigError("");
    setConfigSuccess("");
  };

  const handleValidateConfig = async () => {
    try {
      setIsValidating(true);
      setConfigError("");
      setNextRunTimes([]);

      const mappedExpression = buildCronFromUi(formScheduleType, formScheduleTime);
      const result = await validateSchedulerConfig(mappedExpression, formTimezone);

      if (!result.success) {
        setConfigError(result.error);
        return;
      }

      setNextRunTimes(result.data.nextRunTimes || []);
    } catch (error: any) {
      setConfigError(error?.message || "Validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      setConfigError("");
      setConfigSuccess("");

      const mappedExpression = buildCronFromUi(formScheduleType, formScheduleTime);
      const result = await updateSchedulerConfig({
        expression: mappedExpression,
        timezone: formTimezone,
        enabled: formCronEnabled,
        runOnStartup: formRunOnStartup
      });

      if (!result.success) {
        setConfigError(result.error);
        return;
      }

      setSchedulerConfig(result.data);
      setNextRunTimes(result.data.nextRunTimes || []);
      setConfigSuccess("Cấu hình cron đã được cập nhật thành công!");
      setIsEditingConfig(false);
      setFormScheduleType("daily");
      setFormScheduleTime("09:00");
      setFormTimezone("");
      setFormCronEnabled(true);
      setFormRunOnStartup(false);

      await loadData(filterStatus);
    } catch (error: any) {
      setConfigError(error?.message || "Failed to save config");
    } finally {
      setIsSaving(false);
    }
  };

  const exportRunsAsJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      dashboard,
      runs: filteredRuns
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `agent-runs-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveContext = async () => {
    const isConfirmed = window.confirm("Bạn có chắc muốn lưu cấu hình Agent Context? Các lần chạy tiếp theo sẽ dùng cấu hình mới.");
    if (!isConfirmed) {
      return;
    }

    try {
      setIsSavingContext(true);
      setContextError("");
      setContextSuccess("");

      const payload: Partial<AgentContextConfig> = {
        llm: {
          contentModel,
          contentTemperature,
          topicModel,
          topicTemperature,
          seoModel,
          seoTemperature,
          imagePlannerModel,
          imagePlannerTemperature
        },
        content: {
          systemRolePrompt: contentRolePrompt,
          styleProfiles: textToList(contentStyleProfilesText),
          mandatoryRequirements: textToList(contentRequirementsText)
        },
        workflow: {
          styleBlueprints: textToList(workflowStylesText),
          templateVariations: textToList(workflowTemplatesText)
        },
        topic: {
          strategyPrompt: topicSystemPrompt,
          topicsPerRun: topicPerRun,
          requiredIntents: textToList(topicIntentsText),
          requiredFormats: textToList(topicFormatsText)
        },
        seo: {
          systemPrompt: seoSystemPrompt,
          metadataInstruction: seoMetadataInstruction,
          jsonSchemaLines: textToList(seoSchemaText),
          rules: textToList(seoRulesText)
        },
        image: {
          minInlineImages: imageMin,
          maxInlineImages: imageMax,
          defaultFallbackQuery: imageFallbackQuery,
          plannerPromptAddon: imagePromptAddon,
          providerOrder: textToList(imageProviderOrderText).filter((item) => item === "pexels" || item === "fallback") as Array<"pexels" | "fallback">,
          keywordRules: textToKeywordRules(imageKeywordRulesText),
          tokenTranslationMap: textToTokenMap(imageTokenMapText),
          pexels: {
            endpoint: pexelsEndpoint,
            perPage: pexelsPerPage,
            orientation: pexelsOrientation,
            size: pexelsSize,
            timeoutMs: pexelsTimeoutMs
          }
        }
      };

      const result = await updateAgentContextConfig(payload);
      if (!result.success) {
        setContextError(result.error);
        return;
      }

      applyContextToForm(result.data);
      setContextSuccess("Đã lưu agent context thành công. Các lần chạy mới sẽ dùng cấu hình này.");
    } catch (error: any) {
      setContextError(error?.message || "Không thể lưu agent context.");
    } finally {
      setIsSavingContext(false);
    }
  };

  const handleResetContext = async () => {
    const isConfirmed = window.confirm("Bạn có chắc muốn reset Agent Context về mặc định?");
    if (!isConfirmed) {
      return;
    }

    try {
      setIsSavingContext(true);
      setContextError("");
      setContextSuccess("");
      const reset = await resetAgentContextConfig();
      applyContextToForm(reset);
      setContextSuccess("Đã reset agent context về mặc định.");
    } catch (error: any) {
      setContextError(error?.message || "Không thể reset agent context.");
    } finally {
      setIsSavingContext(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Agent</h1>
          <p className="mt-2 text-gray-600">Theo dõi trạng thái vận hành, hàng đợi công việc và nhật ký chạy workflow.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportRunsAsJson}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download size={16} />
            Xuất JSON
          </button>
          <button
            onClick={() => void loadData(filterStatus)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw size={16} />
            Làm mới
          </button>
          <button
            onClick={handleTriggerNow}
            disabled={isTriggering}
            className="inline-flex items-center gap-2 rounded-lg bg-[#39b54a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f9640] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <PlayCircle size={16} />
            {isTriggering ? "Đang gửi lệnh..." : "Chạy ngay"}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {configSuccess ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {configSuccess}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500"><Activity size={16} /> Trạng thái agent</div>
          <div className={`text-2xl font-bold ${dashboard?.online ? "text-green-600" : "text-gray-900"}`}>{dashboard?.online ? "Online" : "Offline"}</div>
          <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${dashboard?.isRunning ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>
            {dashboard?.isRunning ? "Đang chạy workflow" : "Đang chờ"}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500"><Clock3 size={16} /> Cron schedule</div>
          <div className="text-base font-semibold text-gray-900">{dashboard?.cronExpression ? formatNaturalFromCron(dashboard.cronExpression) : "-"}</div>
          <div className="mt-1 text-xs text-gray-500">Cron: {dashboard?.cronExpression || "-"}</div>
          <div className="mt-2 text-sm text-gray-600">Timezone: {dashboard?.timezone || "-"}</div>
          <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${dashboard?.cronEnabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {dashboard?.cronEnabled ? "Cron bật" : "Cron tắt"}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500"><Timer size={16} /> Queue & Runs</div>
          <div className="text-2xl font-bold text-gray-900">{dashboard?.queuedJobs ?? 0}</div>
          <div className="mt-2 text-sm text-gray-600">Đang chờ xử lý</div>
          <div className="mt-1 text-sm text-gray-600">Tổng run: {dashboard?.totalRuns ?? 0}</div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">Độ ổn định</div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1"><ShieldCheck size={16} className="text-green-600" /> {dashboard?.byStatus?.success ?? 0} success</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1"><ShieldX size={16} className="text-red-600" /> {dashboard?.byStatus?.failed ?? 0} failed</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">Uptime: {dashboard?.uptimeSeconds ?? 0}s</div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Nhóm Nội Dung & Publish</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Bài đã publish</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{dashboard?.contentInsights?.totalPublished ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Trung bình từ/bài</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{dashboard?.contentInsights?.avgWordCount ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Tags trung bình</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{dashboard?.contentInsights?.avgTagsPerArticle ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Top keyword</div>
            <div className="mt-1 text-sm font-semibold text-gray-900">{dashboard?.contentInsights?.topKeywords?.[0]?.label || "-"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">Top Keywords</div>
            <div className="flex flex-wrap gap-2">
              {(dashboard?.contentInsights?.topKeywords ?? []).map((item) => (
                <span key={item.label} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  {item.label} ({item.count})
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">Top Tags</div>
            <div className="flex flex-wrap gap-2">
              {(dashboard?.contentInsights?.topTags ?? []).map((item) => (
                <span key={item.label} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  {item.label} ({item.count})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-3 font-medium">Tiêu đề</th>
                <th className="py-2 pr-3 font-medium">Keyword</th>
                <th className="py-2 pr-3 font-medium">Danh mục (categoryName)</th>
                <th className="py-2 pr-3 font-medium">Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.contentInsights?.recentPublished ?? []).map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-3 text-gray-800">{item.title}</td>
                  <td className="py-2 pr-3 text-gray-700">{item.keyword || "-"}</td>
                  <td className="py-2 pr-3 text-gray-700">{item.categoryName || "-"}</td>
                  <td className="py-2 pr-3 text-gray-600">{formatDateTime(item.publishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Nhóm Ảnh Minh Họa</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500"><ImageIcon size={14} /> Tổng ảnh đã chèn</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{dashboard?.imageInsights?.totalImages ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Ảnh trung bình/bài</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{dashboard?.imageInsights?.avgImagesPerArticle ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Bài thiếu ảnh</div>
            <div className="mt-1 text-xl font-bold text-red-600">{dashboard?.imageInsights?.noImageArticles ?? 0}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Độ phủ ảnh</div>
            <div className="mt-1 text-xl font-bold text-green-700">{dashboard?.imageInsights?.coverageRate ?? 0}%</div>
          </div>
        </div>
      </div>

      {isEditingConfig ? (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Nhóm Cấu Hình Agent</h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {configError ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {configError}
            </div>
          ) : null}

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kiểu lịch</label>
              <select
                value={formScheduleType}
                onChange={(event) => setFormScheduleType(event.target.value as ScheduleType)}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-white px-3 py-2 text-sm font-medium text-black"
              >
                {SCHEDULE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="text-black">{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thời gian chạy</label>
              <select
                value={formScheduleTime}
                onChange={(event) => setFormScheduleTime(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-white px-3 py-2 text-sm font-medium text-black"
              >
                {TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="text-black">{option.label}</option>
                ))}
              </select>
              {(formScheduleType === "every4Hours" || formScheduleType === "every6Hours" || formScheduleType === "every12Hours") ? (
                <p className="mt-1 text-xs text-gray-500">Lưu ý: giờ sẽ chạy theo chu kỳ, phần phút lấy theo mốc thời gian bạn chọn.</p>
              ) : null}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                value={formTimezone}
                onChange={(event) => setFormTimezone(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-white px-3 py-2 text-sm font-medium text-black"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz} value={tz} className="text-black">{tz}</option>
                ))}
              </select>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <div className="font-medium text-gray-800">Lịch tự nhiên</div>
              <div className="mt-1">{formatNaturalSchedule(formScheduleType, formScheduleTime)}</div>
              <div className="mt-1 text-xs text-gray-500">Cron map: {buildCronFromUi(formScheduleType, formScheduleTime)}</div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input type="checkbox" checked={formCronEnabled} onChange={(event) => setFormCronEnabled(event.target.checked)} />
              Bật cron scheduler
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input type="checkbox" checked={formRunOnStartup} onChange={(event) => setFormRunOnStartup(event.target.checked)} />
              Chạy workflow khi startup
            </label>
          </div>

          <div className="mb-4 flex gap-2">
            <button
              onClick={handleValidateConfig}
              disabled={isValidating || !formTimezone}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isValidating ? "Đang xác thực..." : "Xác thực"}
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving || !formTimezone || nextRunTimes.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-[#39b54a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f9640] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>

          {nextRunTimes.length > 0 ? (
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Lần chạy tiếp theo:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                {nextRunTimes.slice(0, 5).map((time, idx) => (
                  <li key={idx}>• {formatDateTime(time)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Nhóm Cấu Hình Agent</h2>
              <p className="mt-1 text-sm text-gray-600">
                Lịch chạy: <span className="font-medium text-gray-900">{schedulerConfig?.cronExpression ? formatNaturalFromCron(schedulerConfig.cronExpression) : "-"}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">Cron: {schedulerConfig?.cronExpression || "-"}</p>
              <p className="mt-1 text-sm text-gray-600">
                Timezone: <span className="font-mono font-medium text-gray-900">{schedulerConfig?.timezone || "-"}</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">Bật cron: <span className="font-medium text-gray-900">{schedulerConfig?.cronEnabled ? "Có" : "Không"}</span></p>
              <p className="mt-1 text-sm text-gray-600">Run on startup: <span className="font-medium text-gray-900">{schedulerConfig?.runOnStartup ? "Có" : "Không"}</span></p>
            </div>
            <button
              onClick={handleEditConfig}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit2 size={16} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Nhóm Phân Tích Hiệu Quả</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500"><BarChart3 size={14} /> Success rate</div>
            <div className="mt-1 text-xl font-bold text-green-700">{dashboard?.successRate ?? 0}%</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Failure rate</div>
            <div className="mt-1 text-xl font-bold text-red-600">{dashboard?.failureRate ?? 0}%</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Avg duration</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{formatDuration(dashboard?.performance?.avgDurationMs)}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-xs text-gray-500">P95 duration</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{formatDuration(dashboard?.performance?.p95DurationMs)}</div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          24h gần nhất: {dashboard?.performance?.last24hRuns ?? 0} runs | success: {dashboard?.performance?.last24hSuccess ?? 0} | failed: {dashboard?.performance?.last24hFailed ?? 0}
        </div>

        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">Lỗi gần nhất</h3>
          {(dashboard?.recentFailures?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500">Không có lỗi gần đây.</p>
          ) : (
            <div className="space-y-2">
              {(dashboard?.recentFailures ?? []).map((item) => (
                <div key={item.id} className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm">
                  <div className="font-medium text-red-700">{item.error}</div>
                  <div className="mt-1 text-xs text-red-600">{item.reason} • {formatDateTime(item.at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách workflow runs</h2>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Tìm theo run id, title, keyword..."
                  className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(event) => void handleFilterChange(event.target.value as "all" | AgentRunStatus)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {state === "loading" ? (
            <p className="py-6 text-sm text-gray-500">Đang tải dữ liệu...</p>
          ) : filteredRuns.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">Chưa có workflow run nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 pr-3 font-medium">Run ID</th>
                    <th className="py-2 pr-3 font-medium">Reason</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Published title</th>
                    <th className="py-2 pr-3 font-medium">Keyword</th>
                    <th className="py-2 pr-3 font-medium">Images</th>
                    <th className="py-2 pr-3 font-medium">Queued</th>
                    <th className="py-2 pr-3 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuns.map((run) => (
                    <tr key={run.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-3 font-mono text-xs text-gray-700">{run.id.slice(0, 8)}...</td>
                      <td className="py-3 pr-3 text-gray-700">{run.reason}</td>
                      <td className="py-3 pr-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass[run.status]}`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-gray-700">{run.title || "-"}</td>
                      <td className="py-3 pr-3 text-gray-600">{run.resultMeta?.keyword || "-"}</td>
                      <td className="py-3 pr-3 text-gray-600">{run.resultMeta?.imageCount ?? "-"}</td>
                      <td className="py-3 pr-3 text-gray-600">{formatDateTime(run.queuedAt)}</td>
                      <td className="py-3 pr-3 text-gray-600">{formatDuration(run.durationMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Logs gần nhất</h2>
          {latestLogs.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có logs.</p>
          ) : (
            <div className="space-y-3">
              {latestLogs.map((log, index) => (
                <div key={`${log.at}-${index}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={`font-semibold ${log.level === "error" ? "text-red-600" : log.level === "warn" ? "text-amber-600" : "text-blue-600"}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-gray-500">{formatDateTime(log.at)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Ngữ Cảnh Agent (Prompt/Template/Style/Topic/Image AI)</h2>
        <p className="mb-3 text-sm text-gray-600">Quản lý ngữ cảnh sinh nội dung và pipeline ảnh theo cơ chế mới: AI chọn keyword, tìm ảnh Pexels, rồi AI chọn ảnh theo mô tả (alt).</p>
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          Luồng ảnh hiện tại: 1) Planner tạo imageName/searchQuery/altText. 2) Keyword Agent tối ưu searchQuery. 3) Tìm nhiều ảnh từ Pexels. 4) Image Selection Agent chọn ảnh phù hợp nhất theo title/summary/content + alt mô tả ảnh.
        </div>

        {contextError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{contextError}</div>
        ) : null}

        {contextSuccess ? (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{contextSuccess}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">LLM Runtime</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Content model</label>
                <input value={contentModel} onChange={(event) => setContentModel(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Content temperature</label>
                <input type="number" step="0.05" min={0} max={2} value={contentTemperature} onChange={(event) => setContentTemperature(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Topic model</label>
                <input value={topicModel} onChange={(event) => setTopicModel(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Topic temperature</label>
                <input type="number" step="0.05" min={0} max={2} value={topicTemperature} onChange={(event) => setTopicTemperature(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">SEO model</label>
                <input value={seoModel} onChange={(event) => setSeoModel(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">SEO temperature</label>
                <input type="number" step="0.05" min={0} max={2} value={seoTemperature} onChange={(event) => setSeoTemperature(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Image AI model (planner + keyword + selector)</label>
                <input value={imagePlannerModel} onChange={(event) => setImagePlannerModel(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Image AI temperature</label>
                <input type="number" step="0.05" min={0} max={2} value={imagePlannerTemperature} onChange={(event) => setImagePlannerTemperature(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
                <p className="mt-1 text-[11px] text-gray-500">Khuyến nghị 0.2 - 0.35 để giữ tính ổn định khi chọn keyword và ảnh.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Content Prompt</h3>
            <label className="mb-1 block text-xs font-medium text-gray-600">System role prompt</label>
            <textarea value={contentRolePrompt} onChange={(event) => setContentRolePrompt(event.target.value)} rows={4} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Style profiles (mỗi dòng 1 profile)</label>
            <textarea value={contentStyleProfilesText} onChange={(event) => setContentStyleProfilesText(event.target.value)} rows={5} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Mandatory requirements (mỗi dòng 1 requirement)</label>
            <textarea value={contentRequirementsText} onChange={(event) => setContentRequirementsText(event.target.value)} rows={6} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Workflow Template</h3>
            <label className="mb-1 block text-xs font-medium text-gray-600">Style blueprints (mỗi dòng 1 mục)</label>
            <textarea value={workflowStylesText} onChange={(event) => setWorkflowStylesText(event.target.value)} rows={5} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Template variations (mỗi dòng 1 template)</label>
            <textarea value={workflowTemplatesText} onChange={(event) => setWorkflowTemplatesText(event.target.value)} rows={7} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Topic Strategy</h3>
            <label className="mb-1 block text-xs font-medium text-gray-600">System prompt</label>
            <textarea value={topicSystemPrompt} onChange={(event) => setTopicSystemPrompt(event.target.value)} rows={4} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-1">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Topics/run</label>
                <input type="number" min={1} max={12} value={topicPerRun} onChange={(event) => setTopicPerRun(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
            </div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Search intents (mỗi dòng 1 intent)</label>
            <textarea value={topicIntentsText} onChange={(event) => setTopicIntentsText(event.target.value)} rows={4} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Format hints (mỗi dòng 1 format)</label>
            <textarea value={topicFormatsText} onChange={(event) => setTopicFormatsText(event.target.value)} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">SEO Prompt</h3>
            <label className="mb-1 block text-xs font-medium text-gray-600">System prompt</label>
            <textarea value={seoSystemPrompt} onChange={(event) => setSeoSystemPrompt(event.target.value)} rows={3} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Metadata instruction</label>
            <textarea value={seoMetadataInstruction} onChange={(event) => setSeoMetadataInstruction(event.target.value)} rows={3} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">JSON schema lines (moi dong 1 dong)</label>
            <textarea value={seoSchemaText} onChange={(event) => setSeoSchemaText(event.target.value)} rows={5} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">SEO rules (moi dong 1 rule)</label>
            <textarea value={seoRulesText} onChange={(event) => setSeoRulesText(event.target.value)} rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Image Matching Strategy (AI Keyword + AI Selector)</h3>
            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Min images</label>
                <input type="number" min={1} max={6} value={imageMin} onChange={(event) => setImageMin(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Max images</label>
                <input type="number" min={1} max={8} value={imageMax} onChange={(event) => setImageMax(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
            </div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Fallback query (khi keyword agent lỗi)</label>
            <input value={imageFallbackQuery} onChange={(event) => setImageFallbackQuery(event.target.value)} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Planner prompt addon (định nghĩa imageName/alt/searchQuery)</label>
            <textarea value={imagePromptAddon} onChange={(event) => setImagePromptAddon(event.target.value)} rows={4} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Provider order (moi dong 1 provider: pexels/fallback)</label>
            <textarea value={imageProviderOrderText} onChange={(event) => setImageProviderOrderText(event.target.value)} rows={3} className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
            <label className="mb-1 block text-xs font-medium text-gray-600">Keyword rules fallback (pattern {"=>"} english keyword, moi dong 1 rule)</label>
            <p className="mb-1 text-[11px] text-gray-500">
              Mục tiêu: bắt các cụm chủ đề thường gặp khi AI keyword lỗi để vẫn ra query đúng ngữ cảnh. Gợi ý bổ sung dữ liệu: xem title/summary bài đã publish nhưng ảnh lệch, gom các cụm lặp lại vào pattern regex, map sang keyword tiếng Anh ngắn (2-4 từ).
            </p>
            <p className="mb-2 text-[11px] text-gray-500">
              Ví dụ: (tuoi nho giot|he thong tuoi) =&gt; irrigation system, (gia the|dat trong) =&gt; organic soil.
            </p>
            <textarea
              value={imageKeywordRulesText}
              onChange={(event) => setImageKeywordRulesText(event.target.value)}
              rows={7}
              placeholder="(tuoi nho giot|he thong tuoi) => irrigation system"
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black"
            />
            <label className="mb-1 block text-xs font-medium text-gray-600">Token translation fallback (token=value, moi dong 1 cap)</label>
            <p className="mb-1 text-[11px] text-gray-500">
              Mục tiêu: dịch token tiếng Việt sang token tiếng Anh để tạo query khi không match rule regex. Gợi ý bổ sung dữ liệu: lấy từ khóa người dùng hay nhập, heading H2/H3 phổ biến, và alt ảnh thực tế từ Pexels để thêm mapping.
            </p>
            <p className="mb-2 text-[11px] text-gray-500">
              Quy tắc: token ngắn, không dấu, ưu tiên danh từ/chủ đề cốt lõi. Ví dụ: gia=substrate, the=substrate, thoat=drainage, nuoc=water.
            </p>
            <textarea
              value={imageTokenMapText}
              onChange={(event) => setImageTokenMapText(event.target.value)}
              rows={6}
              placeholder="gia=substrate"
              className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-600">Pexels endpoint</label>
                <input value={pexelsEndpoint} onChange={(event) => setPexelsEndpoint(event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Pexels per_page</label>
                <input type="number" min={1} max={40} value={pexelsPerPage} onChange={(event) => setPexelsPerPage(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
                <p className="mt-1 text-[11px] text-gray-500">Nên từ 8-15 để Image Selection Agent có đủ ảnh để chọn.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Pexels timeout (ms)</label>
                <input type="number" min={1000} max={30000} value={pexelsTimeoutMs} onChange={(event) => setPexelsTimeoutMs(Number(event.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Pexels orientation</label>
                <select value={pexelsOrientation} onChange={(event) => setPexelsOrientation(event.target.value as "landscape" | "portrait" | "square")} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black">
                  <option value="landscape">landscape</option>
                  <option value="portrait">portrait</option>
                  <option value="square">square</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Pexels size</label>
                <select value={pexelsSize} onChange={(event) => setPexelsSize(event.target.value as "small" | "medium" | "large")} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black">
                  <option value="small">small</option>
                  <option value="medium">medium</option>
                  <option value="large">large</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={handleSaveContext} disabled={isSavingContext} className="inline-flex items-center gap-2 rounded-lg bg-[#39b54a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f9640] disabled:cursor-not-allowed disabled:opacity-60">
            {isSavingContext ? "Đang lưu..." : "Lưu Agent Context"}
          </button>
          <button onClick={handleResetContext} disabled={isSavingContext} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60">
            Reset mặc định
          </button>
          {contextConfig ? (
            <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600">Đã tải cấu hình context hiện tại</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
