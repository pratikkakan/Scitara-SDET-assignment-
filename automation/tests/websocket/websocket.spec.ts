/**
 * Sample WebSocket test template
 */

import { test, expect } from '@playwright/test'
import { WS_URL } from '@/utils/config'

test.describe('WebSocket Integration Tests', () => {
  test('Should connect to WebSocket server', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    let wsConnected = false

    page.on('websocket', (ws) => {
      wsConnected = true
      console.log(`WebSocket opened: ${ws.url}`)
    })

    // Navigate to page that connects to WebSocket
    await page.goto('/')

    // Wait a bit for connection
    await page.waitForTimeout(1000)
    expect(wsConnected).toBe(true)

    await context.close()
  })

  test('Should receive user created event', async ({ browser, request }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    const events: string[] = []

    page.on('websocket', (ws) => {
      ws.on('framesent', (frame) => {
        events.push(frame.payload as string)
      })
    })

    await page.goto('/')

    // Create a user via API (which should emit WebSocket event)
    const createResponse = await request.post('http://localhost:3000/api/users', {
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
      },
    })

    expect(createResponse.status()).toBe(201)

    // Wait for event
    await page.waitForTimeout(2000)

    await context.close()
  })
})
