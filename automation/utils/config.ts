/**
 * Test configuration and utilities
 */

import { defineConfig } from "@playwright/test";

export const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
export const API_ENDPOINT = process.env.API_ENDPOINT || "/api";
export const WS_URL = process.env.WS_URL || "ws://localhost:3001";
export const BROWSER = process.env.BROWSER || "chromium";
export const HEADLESS = process.env.HEADLESS !== "false";
export const SLOW_MO = parseInt(process.env.SLOW_MO || "0");

export const apiConfig = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};
