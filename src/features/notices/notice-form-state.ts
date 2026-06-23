type ActionStatus = "idle" | "success" | "error";

export type AnalyzedNoticeDocumentState = {
  fileName: string;
  documentType: string;
  summary: string;
  warnings: string[];
};

export type GrantNoticeFormState = {
  status: ActionStatus;
  message: string;
  documents: AnalyzedNoticeDocumentState[];
};

export const initialGrantNoticeFormState: GrantNoticeFormState = {
  status: "idle",
  message: "",
  documents: [],
};
