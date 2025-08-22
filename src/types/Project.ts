export interface Project {
  _id?: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  repoUrl?: string;
  liveUrl?: string;
  createdAt?: string;
}
