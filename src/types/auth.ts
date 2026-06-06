import { User } from "./user";
export interface AuthResponse {
  user: User | null;
  loggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
    
}

