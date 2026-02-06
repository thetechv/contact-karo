export type Batch = {
  _id: string;
  batch_id: string;
  qty: number;
  note?: string;
  status?: string;
  createdAt?: string;
};

export type BatchFormState = {
  name: string;
  qty: string;
  notes: string;
};
