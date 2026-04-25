export type SignupUser = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

export type ProjectType ={
  readonly id: string;
  title?: string;
  comment?: string;
  is_completed?: boolean;
  created_at?: string;
  completed_at?: string;
  updated_at?: string;
  total_time?:number | string;
  time_record?:number | string;
  grand_total_time?:number | string;
  uniqueDays?: string[];
}

export type StopWatchDataType = {
  date: number;
  elapsedTime: number;
};

export interface UpdatedItemType {
  title?: string;
  comment?: string;
  created_at?: string;
  is_completed?: boolean;
  date?: string;
  time?: string;
  completed_at? : string;
  time_record?: {
    date: string;
    duration: number;
  }[];
}