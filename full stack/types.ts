
export interface PlacementStats {
  averagePackage: string;
  topRecruiters: string[];
  placementRate: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
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
  uid: string;
  text: string;
  role: 'user' | 'assistant';
  createdAt: unknown;
}
