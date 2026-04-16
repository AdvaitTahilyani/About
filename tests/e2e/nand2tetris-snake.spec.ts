import { expect, type Locator, type Page, test } from '@playwright/test'

const darkPixelCount = async (canvas: Locator) => {
  return canvas.evaluate((node) => {
    const canvasElement = node as HTMLCanvasElement
    const context = canvasElement.getContext('2d')

    if (!context) {
      return 0
    }

    const pixels = context.getImageData(0, 0, canvasElement.width, canvasElement.height).data
    let darkPixels = 0

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] < 64 && pixels[index + 1] < 64 && pixels[index + 2] < 64) {
        darkPixels += 1
      }
    }

    return darkPixels
  })
}

const darkPixelBounds = async (canvas: Locator) => {
  return canvas.evaluate((node) => {
    const canvasElement = node as HTMLCanvasElement
    const context = canvasElement.getContext('2d')

    if (!context) {
      return null
    }

    const pixels = context.getImageData(0, 0, canvasElement.width, canvasElement.height).data
    let minX = canvasElement.width
    let maxX = -1
    let minY = canvasElement.height
    let maxY = -1

    for (let y = 0; y < canvasElement.height; y += 1) {
      for (let x = 0; x < canvasElement.width; x += 1) {
        const index = (y * canvasElement.width + x) * 4

        if (pixels[index] < 64 && pixels[index + 1] < 64 && pixels[index + 2] < 64) {
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    }

    return maxX === -1 ? null : { minX, maxX, minY, maxY }
  })
}

const testCanvasLocator = (page: Page) => page.locator('canvas')

test('nand2tetris Snake demo loads assets and responds to controls', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.goto('/nand2tetris-snake')

  await expect(page.getByRole('heading', { name: /Snake on nand2tetris/i })).toBeVisible()
  await expect(page.getByText('Written in Jack for nand2tetris')).toBeVisible()
  await expect(page.getByText('class Main')).toBeVisible()

  const mainVmResponse = await page.request.get('/demos/nand2tetris-snake/vm/Main.vm')
  expect(mainVmResponse.ok()).toBeTruthy()

  const squareSourceResponse = await page.request.get('/demos/nand2tetris-snake/src/Square.jack')
  expect(squareSourceResponse.ok()).toBeTruthy()

  const canvas = testCanvasLocator(page)
  await expect(canvas).toBeVisible()
  await expect.poll(() => darkPixelCount(canvas)).toBeGreaterThan(0)

  await page.getByRole('button', { name: 'Focus keyboard' }).click()
  await expect(page.locator('[aria-label^="Playable nand2tetris Snake canvas"]')).toBeFocused()

  const beforeStart = await darkPixelBounds(canvas)
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForTimeout(250)
  await expect(page.getByText('Status: Running')).toBeVisible()
  await expect.poll(() => darkPixelBounds(canvas)).not.toEqual(beforeStart)

  const beforeTurn = await darkPixelBounds(canvas)
  expect(beforeTurn).not.toBeNull()
  await page.keyboard.press('ArrowDown')
  await expect
    .poll(async () => {
      const bounds = await darkPixelBounds(canvas)
      return bounds?.minY ?? 0
    })
    .toBeGreaterThan(beforeTurn?.minY ?? 0)

  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByText('Status: Paused')).toBeVisible()
  const pausedPixels = await darkPixelCount(canvas)
  await page.waitForTimeout(150)
  expect(await darkPixelCount(canvas)).toBe(pausedPixels)

  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(page.getByText('Status: Ready')).toBeVisible()
  await expect.poll(() => darkPixelCount(canvas)).toBeGreaterThan(0)

  expect(consoleErrors).toEqual([])
})
