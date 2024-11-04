export interface Registration {
  admissionDate: string;
  email: string;
  employeeName: string;
  status: REGISTRATION_STATUS;
  cpf: string;
  id: number;
}

export enum REGISTRATION_STATUS {
  APPROVED = "APPROVED",
  REVIEW = "REVIEW",
  REPROVED = "REPROVED",
}
