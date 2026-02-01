export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'artist';
  tracksCount?: number;
  createdAt?: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  status: "In Progress" | "Mixed" | "Mastered";
  createdAt: string;
  updatedAt: string;
}

export interface TrackVersion {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userRole: string;
  createdAt: string;
  solved: boolean;
  timestamp?: number | null;
  versionId?: string | null;
}
