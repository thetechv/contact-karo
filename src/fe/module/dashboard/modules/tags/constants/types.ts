export type Tag = {
  _id: string;
  status: string;
  batch_ref: any;
  user_id: any;
  createdAt: string;
};

export type FilterState = {
  status: string;
  search: string;
};

export type TagStats = {
  total: number;
  active: number;
  unassigned: number;
  disabled: number;
};
