import { expect, test } from '@playwright/test'

const runCommand = async (page: import('@playwright/test').Page, command: string) => {
  const input = page.getByLabel('Toy shell command input')
  await input.fill(command)
  await input.press('Enter')
}

test('toy shell provides a sandboxed filesystem', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  await page.goto('/toy-shell')

  await expect(page.getByRole('heading', { name: /Toy Shell Environment/i })).toBeVisible()
  await expect(page.getByText('CS 341 shell, ported to a browser sandbox.')).toBeVisible()

  await runCommand(page, 'pwd')
  await expect(page.getByText('/home/advait')).toBeVisible()

  await runCommand(page, 'mkdir notes')
  await runCommand(page, 'echo hello shell > notes/msg.txt')
  await runCommand(page, 'cat notes/msg.txt')
  await expect(page.getByText('hello shell', { exact: true })).toBeVisible()

  await runCommand(page, 'ls notes')
  await expect(page.getByText('msg.txt', { exact: true })).toBeVisible()

  await runCommand(page, 'rm notes/msg.txt && rmdir notes')
  await runCommand(page, 'ls')
  await expect(page.getByText('projects README.md tmp')).toBeVisible()

  await runCommand(page, 'cat /etc/passwd')
  await expect(page.getByText('cat: /etc/passwd: no such file')).toBeVisible()

  await runCommand(page, 'kill 1')
  await expect(page.getByText('kill: process control is simulated here; no host process can be reached')).toBeVisible()

  const sourceResponse = await page.request.get('/demos/toy-shell/src/shell.c')
  expect(sourceResponse.ok()).toBeTruthy()
  expect(consoleErrors).toEqual([])
})
