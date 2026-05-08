import seedUsers from "./users.json";
import type { UpdateUserInput, User } from "../types/user.types";

const cloneUser = (user: User): User => ({ ...user });
const cloneUsers = (users: User[]): User[] => users.map(cloneUser);

class UserStore {
  private users: User[];

  constructor(initialUsers: User[]) {
    this.users = cloneUsers(initialUsers);
  }

  async getAll(): Promise<User[]> {
    return cloneUsers(this.users);
  }

  async getById(id: string): Promise<User | null> {
    const user = this.users.find((entry) => entry.id === id);
    return user ? cloneUser(user) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.users.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    );
    return user ? cloneUser(user) : null;
  }

  async create(user: User): Promise<User> {
    this.users.push(cloneUser(user));
    return cloneUser(user);
  }

  async update(id: string, updates: UpdateUserInput): Promise<User | null> {
    const userIndex = this.users.findIndex((entry) => entry.id === id);

    if (userIndex === -1) {
      return null;
    }

    const nextUser: User = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = nextUser;
    return cloneUser(nextUser);
  }

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex((entry) => entry.id === id);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }
}

export const userStore = new UserStore(seedUsers as User[]);
