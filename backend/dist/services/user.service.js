"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const uuid_1 = require("uuid");
const userStore_1 = require("../data/userStore");
const appError_1 = require("../utils/appError");
const userEvents_1 = require("../websocket/userEvents");
const normalizeCreateInput = (input) => ({
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    ...(input.phone ? { phone: input.phone.trim() } : {}),
});
const normalizeUpdateInput = (input) => ({
    ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
    ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
    ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
    ...(input.phone ? { phone: input.phone.trim() } : {}),
});
class UserService {
    async getUsers() {
        return userStore_1.userStore.getAll();
    }
    async getUserById(id) {
        const user = await userStore_1.userStore.getById(id);
        if (!user) {
            throw new appError_1.AppError("User not found", 404, "USER_NOT_FOUND");
        }
        return user;
    }
    async createUser(input) {
        const normalizedInput = normalizeCreateInput(input);
        const existingUser = await userStore_1.userStore.getByEmail(normalizedInput.email);
        if (existingUser) {
            throw new appError_1.AppError("A user with this email already exists", 409, "EMAIL_ALREADY_EXISTS");
        }
        const timestamp = new Date().toISOString();
        const user = {
            id: (0, uuid_1.v4)(),
            ...normalizedInput,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
        const createdUser = await userStore_1.userStore.create(user);
        userEvents_1.userWebSocketPublisher.emitUserCreated(createdUser);
        return createdUser;
    }
    async updateUser(id, input) {
        await this.getUserById(id);
        const normalizedInput = normalizeUpdateInput(input);
        if (normalizedInput.email) {
            const existingUser = await userStore_1.userStore.getByEmail(normalizedInput.email);
            if (existingUser && existingUser.id !== id) {
                throw new appError_1.AppError("A user with this email already exists", 409, "EMAIL_ALREADY_EXISTS");
            }
        }
        const updatedUser = await userStore_1.userStore.update(id, normalizedInput);
        if (!updatedUser) {
            throw new appError_1.AppError("User not found", 404, "USER_NOT_FOUND");
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const deleted = await userStore_1.userStore.delete(id);
        if (!deleted) {
            throw new appError_1.AppError("User not found", 404, "USER_NOT_FOUND");
        }
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map