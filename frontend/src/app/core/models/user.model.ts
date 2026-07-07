export interface Section {
  id: string;
  name: string;
  key: string;
}

export interface Profile {
  id: string;
  code: string;
  name: string;
  sections?: Section[];
  created_at: string;
}

export interface User {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  profile_photo: string;
  profiles?: Profile[];
  created_at: string;
}
