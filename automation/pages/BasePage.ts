/**
 * Page Object Model - Base Page class
 * All pages inherit from this base class
 */

import { Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async getUrl() {
    return this.page.url()
  }

  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  async click(selector: string) {
    await this.page.click(selector)
  }

  async fill(selector: string, text: string) {
    await this.page.fill(selector, text)
  }

  async getText(selector: string) {
    return await this.page.textContent(selector)
  }
}
