export const logger = {
  info:  (msg: string, ctx?: object): void => console.log(`[INFO]  ${msg}`, ctx ?? ''),
  warn:  (msg: string, ctx?: object): void => console.warn(`[WARN]  ${msg}`, ctx ?? ''),
  error: (msg: string, ctx?: object): void => console.error(`[ERROR] ${msg}`, ctx ?? ''),
};
