import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import {
  analyzeNoticeDocumentText,
  extractNoticeFileText,
  type NoticeDocumentAnalysis,
} from "./file-analysis";
import {
  getNoticeFileExtension,
  MAX_NOTICE_FILE_COUNT,
  MAX_NOTICE_FILE_SIZE_BYTES,
  validateNoticeFile,
} from "./file-validation";
import { grantNoticeTextInputSchema } from "./notices.schema";
import {
  initialGrantNoticeFormState,
  type AnalyzedNoticeDocumentState,
  type GrantNoticeFormState,
} from "./notice-form-state";

export { initialGrantNoticeFormState };
export type { GrantNoticeFormState };

const GRANT_DOCUMENTS_BUCKET = "grant-documents";

type SupabaseActionError = {
  message?: string;
};

type SupabaseNoticeInsertResult = {
  data: { id: string } | null;
  error: SupabaseActionError | null;
};

type SupabaseMutationResult = {
  error: SupabaseActionError | null;
};

type SupabaseGrantNoticeTable = {
  insert: (values: Record<string, unknown>) => {
    select: (columns: "id") => {
      single: () => PromiseLike<SupabaseNoticeInsertResult>;
    };
  };
};

type SupabaseGrantDocumentTable = {
  insert: (values: Record<string, unknown>[]) => PromiseLike<SupabaseMutationResult>;
};

type SupabaseStorageBucket = {
  upload: (
    path: string,
    file: File,
    options: { contentType: string; upsert: false },
  ) => PromiseLike<{
    data: { path: string } | null;
    error: SupabaseActionError | null;
  }>;
};

type SupabaseNoticeClient = {
  auth: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: SupabaseActionError | null;
    }>;
  };
  from: (
    table: "grant_notices" | "grant_documents",
  ) => SupabaseGrantNoticeTable | SupabaseGrantDocumentTable;
  storage: {
    from: (bucket: typeof GRANT_DOCUMENTS_BUCKET) => SupabaseStorageBucket;
  };
};

export type GrantNoticeActionDependencies = {
  hasSupabaseEnv: () => boolean;
  createClient: () => Promise<SupabaseNoticeClient>;
};

type PreparedNoticeDocument = {
  file: File;
  sha256: string;
  mimeType: string;
  extractedText: string | null;
  analysis: NoticeDocumentAnalysis;
  analysisError: string | null;
};

export async function saveGrantNotice(
  formData: FormData,
  dependencies: GrantNoticeActionDependencies,
): Promise<GrantNoticeFormState> {
  const parsed = grantNoticeTextInputSchema.safeParse({
    title: formData.get("title"),
    source_text: formData.get("source_text"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "공고명과 공고 원문을 기준에 맞게 입력해 주세요.",
      documents: [],
    };
  }

  const attachmentFiles = collectAttachmentFiles(formData);
  const attachmentValidationMessage = validateAttachmentFiles(attachmentFiles);

  if (attachmentValidationMessage) {
    return {
      status: "error",
      message: attachmentValidationMessage,
      documents: [],
    };
  }

  if (!dependencies.hasSupabaseEnv()) {
    return {
      status: "error",
      message:
        "Supabase 환경변수가 설정되지 않아 공고를 저장할 수 없습니다.",
      documents: [],
    };
  }

  const supabase = await dependencies.createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "로그인 후 공고를 저장할 수 있습니다.",
      documents: [],
    };
  }

  const preparedDocuments = await Promise.all(
    attachmentFiles.map((file) => prepareNoticeDocument(file)),
  );
  const { title, source_text } = parsed.data;
  const sourceHash = createHash("sha256").update(source_text).digest("hex");
  const noticeTable = supabase.from("grant_notices") as SupabaseGrantNoticeTable;
  const {
    data: notice,
    error: noticeError,
  } = await noticeTable
    .insert({
      owner_id: user.id,
      title,
      source_text,
      source_hash: sourceHash,
      status: "ready_for_analysis",
    })
    .select("id")
    .single();

  if (noticeError || !notice) {
    return {
      status: "error",
      message: `공고 저장에 실패했습니다: ${
        noticeError?.message ?? "알 수 없는 오류"
      }`,
      documents: [],
    };
  }

  const documentRows = [];

  for (const document of preparedDocuments) {
    const storagePath = buildGrantDocumentStoragePath({
      userId: user.id,
      noticeId: notice.id,
      sha256: document.sha256,
      fileName: document.file.name,
    });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(GRANT_DOCUMENTS_BUCKET)
      .upload(storagePath, document.file, {
        contentType: document.mimeType,
        upsert: false,
      });

    if (uploadError) {
      return {
        status: "error",
        message: `공고는 저장됐지만 첨부 파일 업로드에 실패했습니다: ${
          uploadError.message ?? "알 수 없는 오류"
        }`,
        documents: [],
      };
    }

    documentRows.push({
      owner_id: user.id,
      grant_notice_id: notice.id,
      storage_path: uploadData?.path ?? storagePath,
      original_filename: document.file.name,
      mime_type: document.mimeType,
      size_bytes: document.file.size,
      sha256: document.sha256,
      extracted_text: document.extractedText,
      analysis_summary: document.analysis.summary,
      analysis_json: document.analysis,
      analysis_error: document.analysisError,
    });
  }

  if (documentRows.length > 0) {
    const documentTable = supabase.from(
      "grant_documents",
    ) as SupabaseGrantDocumentTable;
    const { error: documentError } = await documentTable.insert(documentRows);

    if (documentError) {
      return {
        status: "error",
        message: `공고는 저장됐지만 첨부 파일 분석 결과 저장에 실패했습니다: ${
          documentError.message ?? "알 수 없는 오류"
        }`,
        documents: [],
      };
    }
  }

  return {
    status: "success",
    message:
      documentRows.length > 0
        ? `공고가 저장되고 첨부 파일 ${documentRows.length}개를 분석했습니다.`
        : "공고가 저장되었습니다. 다음 단계에서 자격 판정과 적합성 평가를 진행할 수 있습니다.",
    documents: preparedDocuments.map(toDocumentState),
  };
}

function collectAttachmentFiles(formData: FormData) {
  return formData
    .getAll("attachments")
    .filter(isFileLike)
    .filter((file) => file.name.trim().length > 0 && file.size > 0);
}

function isFileLike(value: FormDataEntryValue): value is File {
  return (
    typeof value !== "string" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.size === "number" &&
    typeof value.arrayBuffer === "function"
  );
}

function validateAttachmentFiles(files: File[]) {
  if (files.length > MAX_NOTICE_FILE_COUNT) {
    return `첨부 파일은 한 번에 최대 ${MAX_NOTICE_FILE_COUNT}개까지 등록할 수 있습니다.`;
  }

  for (const file of files) {
    const validation = validateNoticeFile(file);

    if (validation.ok) {
      continue;
    }

    if (validation.reason === "too_large") {
      return `${file.name} 파일이 너무 큽니다. 첨부 파일은 ${formatBytes(
        MAX_NOTICE_FILE_SIZE_BYTES,
      )} 이하만 등록할 수 있습니다.`;
    }

    return `${file.name}은 지원하지 않는 파일 형식입니다. PDF, DOCX, TXT, MD 파일만 등록할 수 있습니다.`;
  }

  return "";
}

async function prepareNoticeDocument(
  file: File,
): Promise<PreparedNoticeDocument> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const mimeType = resolveNoticeFileMimeType(file);
  let extractedText: string | null = null;
  let extractionWarnings: string[] = [];
  let analysisError: string | null = null;

  try {
    const extraction = await extractNoticeFileText(file);
    extractedText = extraction.text || null;
    extractionWarnings = extraction.warnings;
  } catch (error) {
    analysisError =
      error instanceof Error ? error.message : "텍스트 추출 중 오류가 발생했습니다.";
    extractionWarnings = ["파일 텍스트 추출에 실패해 파일명 중심으로 분석했습니다."];
  }

  const analysis = analyzeNoticeDocumentText({
    fileName: file.name,
    mimeType,
    text: extractedText ?? "",
    warnings: extractionWarnings,
  });

  return {
    file,
    sha256,
    mimeType,
    extractedText,
    analysis,
    analysisError,
  };
}

function resolveNoticeFileMimeType(file: File) {
  if (file.type) {
    return file.type;
  }

  const extension = getNoticeFileExtension(file.name);

  if (extension === "pdf") {
    return "application/pdf";
  }

  if (extension === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (extension === "md") {
    return "text/markdown";
  }

  return "text/plain";
}

function buildGrantDocumentStoragePath(input: {
  userId: string;
  noticeId: string;
  sha256: string;
  fileName: string;
}) {
  const safeFileName = input.fileName
    .normalize("NFKC")
    .replace(/[\\/#?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 120);

  return `${input.userId}/${input.noticeId}/${input.sha256.slice(
    0,
    16,
  )}-${safeFileName}`;
}

function toDocumentState(
  document: PreparedNoticeDocument,
): AnalyzedNoticeDocumentState {
  return {
    fileName: document.file.name,
    documentType: document.analysis.documentType,
    summary: document.analysis.summary,
    warnings: document.analysis.warnings,
  };
}

function formatBytes(bytes: number) {
  const megabytes = bytes / 1024 / 1024;

  return `${megabytes.toLocaleString("ko-KR", {
    maximumFractionDigits: 1,
  })}MB`;
}
