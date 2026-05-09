"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStore = void 0;
const users_json_1 = __importDefault(require("./users.json"));
const cloneUser = (user) => ({ ...user });
const cloneUsers = (users) => users.map(cloneUser);
class UserStore {
    constructor(initialUsers) {
        this.users = cloneUsers(initialUsers);
    }
    async getAll() {
        return cloneUsers(this.users);
    }
    async getById(id) {
        const user = this.users.find((entry) => entry.id === id);
        return user ? cloneUser(user) : null;
    }
    async getByEmail(email) {
        const user = this.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
        return user ? cloneUser(user) : null;
    }
    async create(user) {
        this.users.push(cloneUser(user));
        return cloneUser(user);
    }
    async update(id, updates) {
        const userIndex = this.users.findIndex((entry) => entry.id === id);
        if (userIndex === -1) {
            return null;
        }
        const nextUser = {
            ...this.users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        this.users[userIndex] = nextUser;
        return cloneUser(nextUser);
    }
    async delete(id) {
        const userIndex = this.users.findIndex((entry) => entry.id === id);
        if (userIndex === -1) {
            return false;
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}
exports.userStore = new UserStore(users_json_1.default);
//# sourceMappingURL=userStore.js.map