export interface Note {
  id: string;
  title: string;
  content: string;
  project: string;
  tags: string[];
  kind: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  project: string;
  tags: string[];
  kind: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  project?: string;
  tags?: string[];
  kind?: string;
}
