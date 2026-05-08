import { v4 as uuidv4 } from "uuid";
import { userStore } from "../data/userStore";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user.types";
import { AppError } from "../utils/appError";
import { userWebSocketPublisher } from "../websocket/userEvents";

const normalizeCreateInput = (input: CreateUserInput): CreateUserInput => ({
  firstName: input.firstName.trim(),
  lastName: input.lastName.trim(),
  email: input.email.trim().toLowerCase(),
  ...(input.phone ? { phone: input.phone.trim() } : {}),
});

const normalizeUpdateInput = (input: UpdateUserInput): UpdateUserInput => ({
  ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
  ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
  ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
  ...(input.phone ? { phone: input.phone.trim() } : {}),
});

class UserService {
  async getUsers(): Promise<User[]> {
    return userStore.getAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await userStore.getById(id);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const normalizedInput = normalizeCreateInput(input);
    const existingUser = await userStore.getByEmail(normalizedInput.email);

    if (existingUser) {
      throw new AppError(
        "A user with this email already exists",
        409,
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const timestamp = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      ...normalizedInput,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const createdUser = await userStore.create(user);

    userWebSocketPublisher.emitUserCreated(createdUser);

    return createdUser;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    await this.getUserById(id);

    const normalizedInput = normalizeUpdateInput(input);

    if (normalizedInput.email) {
      const existingUser = await userStore.getByEmail(normalizedInput.email);

      if (existingUser && existingUser.id !== id) {
        throw new AppError(
          "A user with this email already exists",
          409,
          "EMAIL_ALREADY_EXISTS",
        );
      }
    }

    const updatedUser = await userStore.update(id, normalizedInput);

    if (!updatedUser) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await userStore.delete(id);

    if (!deleted) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
  }
}

export const userService = new UserService();
