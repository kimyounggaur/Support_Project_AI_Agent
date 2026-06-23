export type NoticeFileCandidate = {
  name: string;
  type: string;
  size: number;
};

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: "unsupported_type" | "too_large" };

export const MAX_NOTICE_FILE_SIZE_BYTES = 6 * 1024 * 1024;

export const MAX_NOTICE_FILE_COUNT = 5;

export const SUPPORTED_NOTICE_FILE_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]);

const SUPPORTED_NOTICE_FILE_EXTENSIONS = new Set(["pdf", "docx", "txt", "md"]);

export function getNoticeFileExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.trim().toLowerCase();

  return extension && extension !== fileName.toLowerCase() ? extension : "";
}

export function isSupportedNoticeFileType(file: NoticeFileCandidate) {
  if (SUPPORTED_NOTICE_FILE_MIME_TYPES.has(file.type)) {
    return true;
  }

  if (file.type && file.type !== "application/octet-stream") {
    return false;
  }

  return SUPPORTED_NOTICE_FILE_EXTENSIONS.has(getNoticeFileExtension(file.name));
}

export function validateNoticeFile(
  file: NoticeFileCandidate,
): FileValidationResult {
  if (file.size > MAX_NOTICE_FILE_SIZE_BYTES) {
    return { ok: false, reason: "too_large" };
  }

  if (!isSupportedNoticeFileType(file)) {
    return { ok: false, reason: "unsupported_type" };
  }

  return { ok: true };
}
