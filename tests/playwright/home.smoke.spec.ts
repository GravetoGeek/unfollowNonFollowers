import { expect, test } from '@playwright/test'

test('home carrega e exibe campos principais', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#username-input')).toBeVisible()
    await expect(page.locator('#api-key-input')).toBeVisible()
    await expect(page.getByRole('button', { name: /buscar|search/i })).toBeVisible()
})
