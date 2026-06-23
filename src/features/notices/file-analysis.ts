import { getNoticeFileExtension } from "./file-validation";

export type NoticeDocumentType =
  | "grant_notice"
  | "business_plan_template"
  | "evidence_guide"
  | "application_form"
  | "unknown";

export type ExtractedNoticeFileText = {
  text: string;
  truncated: boolean;
  warnings: string[];
};

export type NoticeDocumentAnalysisInput = {
  fileName: string;
  mimeType: string;
  text: string;
  warnings: string[];
};

export type NoticeDocumentAnalysis = {
  documentType: NoticeDocumentType;
  summary: string;
  keywords: string[];
  deadlines: string[];
  fundingAmounts: string[];
  eligibilitySignals: string[];
  requiredDocuments: string[];
  warnings: string[];
  confidence: "high" | "medium" | "low";
};

const MAX_ANALYSIS_TEXT_CHARS = 120_000;
const MAX_SIGNAL_COUNT = 8;

const KEYWORD_CANDIDATES = [
  "초기창업패키지",
  "예비창업",
  "사업화",
  "지원대상",
  "접수기간",
  "선정평가",
  "제출서류",
  "사업계획서",
  "증빙서류",
  "창업기업",
  "중소기업",
];

const REQUIRED_DOCUMENT_KEYWORDS = [
  "제출서류",
  "제출 서류",
  "증빙",
  "사업계획서",
  "신청서",
  "동의서",
  "서약서",
  "사업자등록증",
  "등본",
  "증명서",
  "첨부",
];

const ELIGIBILITY_KEYWORDS = [
  "지원대상",
  "지원 대상",
  "신청자격",
  "신청 자격",
  "자격요건",
  "자격 요건",
  "업력",
  "창업기업",
  "중소기업",
  "소재지",
  "제외대상",
  "제외 대상",
  "결격",
];

export async function extractNoticeFileText(
  file: File,
): Promise<ExtractedNoticeFileText> {
  const extension = getNoticeFileExtension(file.name);
  const mimeType = file.type || mimeTypeFromExtension(extension);

  if (mimeType === "text/plain" || mimeType === "text/markdown") {
    return limitAnalysisText(await file.text(), []);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (mimeType === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();

      return limitAnalysisText(result.text ?? "", []);
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    const warnings = result.messages.map((message) => message.message);

    return limitAnalysisText(result.value ?? "", warnings);
  }

  return {
    text: "",
    truncated: false,
    warnings: ["지원하지 않는 파일 형식이라 텍스트를 추출하지 못했습니다."],
  };
}

export function analyzeNoticeDocumentText(
  input: NoticeDocumentAnalysisInput,
): NoticeDocumentAnalysis {
  const normalized = normalizeText(input.text);
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const searchable = `${input.fileName}\n${normalized}`;
  const documentType = detectDocumentType(searchable);
  const deadlines = uniqueMatches(searchable, [
    /20\d{2}\s*[.\-/년]\s*\d{1,2}\s*[.\-/월]\s*\d{1,2}\s*일?(?:\s*\d{1,2}:\d{2})?/g,
  ]);
  const fundingAmounts = uniqueMatches(searchable, [
    /(?:최대|총|사업화\s*자금|지원금|정부지원금)?\s*\d[\d,]*(?:\.\d+)?\s*(?:억\s*원|억원|천만\s*원|만원|원)/g,
  ]);
  const requiredDocuments = extractSignals(lines, REQUIRED_DOCUMENT_KEYWORDS);
  const eligibilitySignals = extractSignals(lines, ELIGIBILITY_KEYWORDS);
  const keywords = KEYWORD_CANDIDATES.filter((keyword) =>
    searchable.includes(keyword),
  );
  const warnings = [...input.warnings];

  if (normalized.length === 0) {
    warnings.push("텍스트가 추출되지 않아 파일명 중심으로만 분석했습니다.");
  } else if (normalized.length < 200) {
    warnings.push("추출된 텍스트가 짧아 분석 신뢰도가 낮을 수 있습니다.");
  }

  return {
    documentType,
    summary: buildSummary({
      fileName: input.fileName,
      lines,
      deadlines,
      fundingAmounts,
      eligibilitySignals,
      requiredDocuments,
    }),
    keywords: keywords.slice(0, MAX_SIGNAL_COUNT),
    deadlines: deadlines.slice(0, MAX_SIGNAL_COUNT),
    fundingAmounts: fundingAmounts.slice(0, MAX_SIGNAL_COUNT),
    eligibilitySignals: eligibilitySignals.slice(0, MAX_SIGNAL_COUNT),
    requiredDocuments: requiredDocuments.slice(0, MAX_SIGNAL_COUNT),
    warnings,
    confidence: normalized.length > 500 ? "high" : normalized.length > 0 ? "medium" : "low",
  };
}

function mimeTypeFromExtension(extension: string) {
  if (extension === "pdf") {
    return "application/pdf";
  }

  if (extension === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (extension === "md") {
    return "text/markdown";
  }

  if (extension === "txt") {
    return "text/plain";
  }

  return "";
}

function limitAnalysisText(text: string, warnings: string[]) {
  const normalized = normalizeText(text);

  if (normalized.length <= MAX_ANALYSIS_TEXT_CHARS) {
    return {
      text: normalized,
      truncated: false,
      warnings,
    };
  }

  return {
    text: normalized.slice(0, MAX_ANALYSIS_TEXT_CHARS),
    truncated: true,
    warnings: [
      ...warnings,
      "문서가 길어 앞부분 중심으로 분석했습니다.",
    ],
  };
}

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function detectDocumentType(text: string): NoticeDocumentType {
  if (/사업계획서/.test(text) && /(양식|작성|가이드|서식)/.test(text)) {
    return "business_plan_template";
  }

  if (/(증빙서류|증빙\s*서류|제출목록)/.test(text)) {
    return "evidence_guide";
  }

  if (/(공고|모집|지원사업)/.test(text)) {
    return "grant_notice";
  }

  if (/(신청서|동의서|서약서)/.test(text)) {
    return "application_form";
  }

  return "unknown";
}

function uniqueMatches(text: string, patterns: RegExp[]) {
  const values = new Set<string>();

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[0].replace(/\s+/g, " ").trim();

      if (value.length > 0) {
        values.add(value);
      }
    }
  }

  return Array.from(values);
}

function extractSignals(lines: string[], keywords: string[]) {
  const signals = new Set<string>();

  for (const line of lines) {
    if (!keywords.some((keyword) => line.includes(keyword))) {
      continue;
    }

    const payload = line.includes(":") ? line.split(":").slice(1).join(":") : line;
    const parts = payload
      .split(/[,·•;]+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 2 && part.length <= 120);

    for (const part of parts.length > 0 ? parts : [line]) {
      signals.add(part);
    }
  }

  return Array.from(signals);
}

function buildSummary(input: {
  fileName: string;
  lines: string[];
  deadlines: string[];
  fundingAmounts: string[];
  eligibilitySignals: string[];
  requiredDocuments: string[];
}) {
  const title = input.lines.find((line) => line.length >= 8) ?? input.fileName;
  const details = [
    input.deadlines[0] ? `주요 일정 ${input.deadlines[0]}` : "",
    input.fundingAmounts[0] ? `지원 규모 ${input.fundingAmounts[0]}` : "",
    input.eligibilitySignals[0] ? `대상 ${input.eligibilitySignals[0]}` : "",
    input.requiredDocuments[0] ? `필수 서류 ${input.requiredDocuments[0]}` : "",
  ].filter(Boolean);
  const summary = [title, ...details].join(" · ");

  return summary.length > 280 ? `${summary.slice(0, 277)}...` : summary;
}
