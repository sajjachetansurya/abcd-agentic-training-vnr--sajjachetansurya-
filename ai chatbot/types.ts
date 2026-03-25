
export interface PlacementStats {
  averagePackage: string;
  topRecruiters: string[];
  placementRate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  gender: 'male' | 'female' | 'other' | '';
  dob: string;
  username: string;
  passwordHash: string; // In a real app, never store plain passwords. This is a simulation.
}

export interface College {
  id:string;
  name: string;
  logo?: string;
  ranking: string;
  placements?: PlacementStats;
  syllabus: string[];
  campusLife: string;
  admissionProcess: string;
  cutoffs: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}