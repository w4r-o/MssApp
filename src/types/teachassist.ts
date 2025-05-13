export interface CourseData {
  id: string;
  name: string;
  code: string;
  teacher: string;
  room: string;
  mark: string | number;
  block: string;
  assignments?: Assignment[];
}

export interface Assignment {
  name: string;
  feedback?: string;
  K?: Array<{ get: number; total: number; weight: number; percentage: number }>;
  T?: Array<{ get: number; total: number; weight: number; percentage: number }>;
  C?: Array<{ get: number; total: number; weight: number; percentage: number }>;
  A?: Array<{ get: number; total: number; weight: number; percentage: number }>;
} 