export type Batch = {
  _id: string;
  batch_id: string;
  qty: number;
  type: "car" | "bike" | "bag-tag" | "door-tag" | "business-card";
  note?: string;
  status?: string;
  createdAt?: string;
};

export type BatchFormState = {
  name: string;
  qty: string;
  notes: string;
};
