type WizardState = {
  topic?: string;
  topicQuestions?: {
    questions: Array<{
      id: "q1" | "q2" | "q3" | "q4";
      question: string;
      options: string[];
    }>;
  };
  topicAnswers?: Record<string, string>;
  profile?: {
    learningStyle: "examples" | "logic" | "stories" | "direct";
    goal: "exam" | "career" | "curiosity" | "specific_topic";
    extraContext?: string;
  };
};

const KEY = "learnmap:wizard";

export function readWizardState(): WizardState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WizardState) : {};
  } catch {
    return {};
  }
}

const TOPIC_QUESTIONS_CACHE_PREFIX = "learnmap:topic-questions:";

export function readCachedTopicQuestions(
  topic: string
): WizardState["topicQuestions"] | null {
  if (typeof window === "undefined") return null;
  const t = topic.trim();
  if (!t) return null;

  try {
    const raw = window.localStorage.getItem(
      TOPIC_QUESTIONS_CACHE_PREFIX + t.toLowerCase()
    );
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      savedAt: number;
      value: WizardState["topicQuestions"];
    };
    if (!parsed?.savedAt || !parsed?.value) return null;

    // TTL: 7 days
    const ttlMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.savedAt > ttlMs) return null;

    return parsed.value;
  } catch {
    return null;
  }
}

export function writeCachedTopicQuestions(
  topic: string,
  value: WizardState["topicQuestions"]
) {
  if (typeof window === "undefined") return;
  const t = topic.trim();
  if (!t) return;

  try {
    window.localStorage.setItem(
      TOPIC_QUESTIONS_CACHE_PREFIX + t.toLowerCase(),
      JSON.stringify({ savedAt: Date.now(), value })
    );
  } catch {
    // ignore quota/security errors
  }
}

export function clearCachedTopicQuestions(topic: string) {
  if (typeof window === "undefined") return;
  const t = topic.trim();
  if (!t) return;
  try {
    window.localStorage.removeItem(TOPIC_QUESTIONS_CACHE_PREFIX + t.toLowerCase());
  } catch {
    // ignore
  }
}

export function writeWizardState(next: WizardState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function updateWizardState(patch: Partial<WizardState>) {
  const current = readWizardState();
  writeWizardState({ ...current, ...patch });
}

export function clearWizardState() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}
