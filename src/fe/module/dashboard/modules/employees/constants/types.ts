export type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
};

export type EmployeeFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
};

export type FormErrors = Record<string, string>;
