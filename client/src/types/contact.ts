export interface Contact {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
}

export interface ContactPayload {
  name: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
}
