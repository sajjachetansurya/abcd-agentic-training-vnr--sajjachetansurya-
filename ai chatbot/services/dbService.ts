
import { User } from '../types';

const USERS_KEY = 'college_chatbot_v2_users';
const SESSION_KEY = 'college_chatbot_v2_session';

export interface UserDBRecord extends User {
  salt: string;
}

export class DBService {
  static getUsers(): UserDBRecord[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveUser(user: UserDBRecord): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static findUserByUsername(username: string): UserDBRecord | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  static updateUser(updatedUser: UserDBRecord): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }

  static setSession(token: string, userId: string): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, userId, expiry: Date.now() + 3600000 }));
  }

  static getSession(): { token: string; userId: string; expiry: number } | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
