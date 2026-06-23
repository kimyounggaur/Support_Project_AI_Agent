export type NoticeFileCandidate = {
  name: string;
  type: string;
  size: number;
};

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: "unsupported_type" | "too_large" };

const MAX_NOTICE_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]);

export function validateNoticeFile(
  file: NoticeFileCandidate,
): FileValidationResult {
  if (file.size > MAX_NOTICE_FILE_SIZE_BYTES) {
    return { ok: false, reason: "too_large" };
  }

  if (!SUPPORTED_MIME_TYPES.has(file.type)) {
    return { ok: false, reason: "unsupported_type" };
  }

  return { ok: true };
}
