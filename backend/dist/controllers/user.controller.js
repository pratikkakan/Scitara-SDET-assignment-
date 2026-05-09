"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const user_service_1 = require("../services/user.service");
const responseHandlers_1 = require("../utils/responseHandlers");
const createUser = async (req, res) => {
    const user = await user_service_1.userService.createUser(req.body);
    (0, responseHandlers_1.sendCreated)(res, user, `${req.baseUrl}/${user.id}`);
};
exports.createUser = createUser;
const getUsers = async (_req, res) => {
    const users = await user_service_1.userService.getUsers();
    (0, responseHandlers_1.sendOk)(res, users);
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await user_service_1.userService.getUserById(id);
    (0, responseHandlers_1.sendOk)(res, user);
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await user_service_1.userService.updateUser(id, req.body);
    (0, responseHandlers_1.sendOk)(res, user);
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await user_service_1.userService.deleteUser(id);
    (0, responseHandlers_1.sendNoContent)(res);
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map