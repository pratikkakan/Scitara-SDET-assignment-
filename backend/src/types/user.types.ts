/**
 * User Interface - API Types and Contracts
 */

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface IUpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}
