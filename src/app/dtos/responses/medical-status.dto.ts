export class MedicalStatus {
  $key?: string;
  specialisation: string;
  category: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  limit250k: string; // 250,000
  limit500k: string; // 500,000
  limit1m: string;   // 1,000,000
  limit1p5m: string; // 1,500,000
  limit2m: string;   // 2,000,000
  limit3m: string;   // 3,000,000
  limit5m: string;   // 5,000,000
}