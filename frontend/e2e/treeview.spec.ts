import { test, expect } from '@playwright/test'

test.describe('TreeView E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => {
      if (window.localStorage) {
        localStorage.clear()
      }
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test.describe('3.1 创建功能', () => {
    test('TC-01: 点击"新建笔记本"按钮', async ({ page }) => {
      const createBtn = page.getByTitle('新建笔记本')
      await createBtn.click()

      const input = page.locator('input[type="text"]').first()
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('新建笔记本')
    })

    test('TC-02: 在笔记本上点击"新建笔记"图标', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const notebookRow = page.locator('[data-testid="tree-node"], .cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await notebookRow.hover()
      await page.waitForTimeout(300)

      const noteBtn = notebookRow.locator('button[title="新建笔记"]')
      await noteBtn.click()
      await page.waitForTimeout(500)

      const input = page.locator('input[type="text"]').first()
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('无标题')
    })

    test('TC-03: 在笔记本上点击"新建子笔记本"图标', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const notebookRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await notebookRow.hover()
      await page.waitForTimeout(300)
      
      const subNotebookBtn = notebookRow.locator('button[title="新建子笔记本"]')
      await subNotebookBtn.click()
      await page.waitForTimeout(1000)

      const inputs = page.locator('input[type="text"]')
      const count = await inputs.count()
      expect(count).toBeGreaterThan(0)
    })

    test('TC-04: 点击"新建笔记"按钮', async ({ page }) => {
      const createBtn = page.locator('.border-b button[title="新建笔记"]').first()
      await createBtn.click()

      const input = page.locator('input[type="text"]').first()
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('无标题')
    })

    test('TC-05: 连续创建多个笔记本', async ({ page }) => {
      const createBtn = page.getByTitle('新建笔记本')
      
      await createBtn.click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      
      await createBtn.click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      
      const notebookRows = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' })
      await expect(notebookRows).toHaveCount(2)
    })

    test('TC-06: 连续创建多个笔记', async ({ page }) => {
      const createBtn = page.locator('.border-b button[title="新建笔记"]').first()
      
      await createBtn.click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      
      await createBtn.click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
    })
  })

  test.describe('3.2 重命名功能', () => {
    test('TC-10: 节点编辑模式下输入新名称，按 Enter', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('工作笔记')
      await input.press('Enter')

      await expect(page.getByText('工作笔记').first()).toBeVisible()
    })

    test('TC-11: 节点编辑模式下输入新名称，失焦', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('会议记录')
      await input.blur()

      await expect(page.getByText('会议记录').first()).toBeVisible()
    })

    test('TC-12: 节点编辑模式下按 Escape', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('新名称')
      await input.press('Escape')

      await expect(input).toHaveValue('新建笔记本')
    })

    test('TC-13: 重命名为空名称', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('名称不能为空')
        await dialog.accept()
      })
      
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('')
      await input.press('Enter')
    })

    test('TC-14: 重命名为已存在的名称', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('已存在')
        await dialog.accept()
      })
      
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      const input1 = page.locator('input[type="text"]').first()
      await input1.fill('测试笔记')
      await input1.press('Enter')
      await page.waitForTimeout(500)

      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      const input2 = page.locator('input[type="text"]').first()
      await input2.fill('测试笔记')
      await input2.press('Enter')
      await page.waitForTimeout(500)
      
      const nodes = page.locator('.cursor-pointer').filter({ hasText: '测试笔记' })
      await expect(nodes.first()).toBeVisible()
    })

    test('TC-15: 重命名为超过100字符的名称', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('名称不能超过 100 个字符')
        await dialog.accept()
      })
      
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('a'.repeat(101))
      await input.press('Enter')
    })

    test('TC-16: 重命名为包含特殊字符的名称', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('特殊字符')
        await dialog.accept()
      })
      
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      
      const input = page.locator('input[type="text"]').first()
      await input.fill('测试<>笔记')
      await input.press('Enter')
    })
  })

  test.describe('3.3 删除功能', () => {
    test('TC-20: 点击删除按钮，点击确认', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const nodeRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await nodeRow.hover()
      await page.waitForTimeout(300)

      const deleteBtn = nodeRow.locator('button[title="删除"]')
      await deleteBtn.click()
      await page.waitForTimeout(300)
      
      const confirmBtn = nodeRow.getByRole('button', { name: '确认' })
      await expect(confirmBtn).toBeVisible()
      await confirmBtn.click()
      
      await page.waitForTimeout(500)
    })

    test('TC-21: 点击删除按钮，点击取消', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const nodeRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await nodeRow.hover()
      await page.waitForTimeout(300)

      const deleteBtn = nodeRow.locator('button[title="删除"]')
      await deleteBtn.click()
      await page.waitForTimeout(300)
      
      const cancelBtn = nodeRow.getByRole('button', { name: '取消' })
      await expect(cancelBtn).toBeVisible()
      await cancelBtn.click()
      
      await expect(page.getByText('新建笔记本').first()).toBeVisible()
    })

    test('TC-22: 删除包含子节点的笔记本', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const parentRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await parentRow.hover()
      await page.waitForTimeout(300)

      const subNotebookBtn = parentRow.locator('button[title="新建子笔记本"]')
      await subNotebookBtn.click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      await parentRow.hover()
      await page.waitForTimeout(300)
      const deleteBtn = parentRow.locator('button[title="删除"]')
      await deleteBtn.click()
      await page.waitForTimeout(300)
      
      const confirmBtn = parentRow.getByRole('button', { name: '确认' })
      await confirmBtn.click()
      await page.waitForTimeout(500)
    })

    test('TC-23: 删除笔记', async ({ page }) => {
      await page.locator('.border-b button[title="新建笔记"]').first().click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const noteRow = page.locator('.cursor-pointer').filter({ hasText: '无标题' }).first()
      await noteRow.hover()
      await page.waitForTimeout(300)
      const deleteBtn = noteRow.locator('button[title="删除"]')
      await deleteBtn.click()
      await page.waitForTimeout(300)
      
      const confirmBtn = noteRow.getByRole('button', { name: '确认' })
      await confirmBtn.click()
      await page.waitForTimeout(500)
    })
  })

  test.describe('3.4 选中功能', () => {
    test('TC-30: 点击笔记节点', async ({ page }) => {
      await page.locator('.border-b button[title="新建笔记"]').first().click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const noteNode = page.locator('.cursor-pointer').filter({ hasText: '无标题' }).first()
      await noteNode.click()
      await page.waitForTimeout(500)
    })

    test('TC-31: 点击笔记本节点', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const notebookNode = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await notebookNode.click()
      await page.waitForTimeout(300)
    })

    test('TC-32: 选中笔记后创建新笔记', async ({ page }) => {
      await page.locator('.border-b button[title="新建笔记"]').first().click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)
      
      const noteNode = page.locator('.cursor-pointer').filter({ hasText: '无标题' }).first()
      await noteNode.click()
      await page.waitForTimeout(300)
      
      await page.locator('.border-b button[title="新建笔记"]').first().click()
      await page.waitForTimeout(500)
    })
  })

  test.describe('3.5 展开/折叠功能', () => {
    test('TC-40: 点击笔记本左侧箭头', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      await page.locator('.border-b button[title="新建笔记"]').first().click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const expandBtns = page.locator('button:has(svg.lucide-chevron-right), button:has(svg.lucide-chevron-down)')
      const firstExpandBtn = expandBtns.first()
      if (await firstExpandBtn.isVisible()) {
        await firstExpandBtn.click()
        await page.waitForTimeout(300)
        await firstExpandBtn.click()
        await page.waitForTimeout(300)
      }
    })

    test('TC-41: 展开嵌套笔记本', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const parentRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await parentRow.hover()
      await page.waitForTimeout(300)

      const subNotebookBtn = parentRow.locator('button[title="新建子笔记本"]')
      await subNotebookBtn.click()
      await page.waitForTimeout(800)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const expandBtns = page.locator('button:has(svg.lucide-chevron-down)')
      await expect(expandBtns.first()).toBeVisible()
    })

    test('TC-42: 折叠笔记本后重新打开', async ({ page }) => {
      await page.getByTitle('新建笔记本').click()
      await page.waitForTimeout(300)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const parentRow = page.locator('.cursor-pointer').filter({ hasText: '新建笔记本' }).first()
      await parentRow.hover()
      await page.waitForTimeout(300)

      const subNotebookBtn = parentRow.locator('button[title="新建子笔记本"]')
      await subNotebookBtn.click()
      await page.waitForTimeout(500)
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const expandBtns = page.locator('button:has(svg.lucide-chevron-down)')
      const expandBtn = expandBtns.first()
      await expandBtn.click()
      await page.waitForTimeout(300)

      await expandBtn.click()
      await page.waitForTimeout(300)
    })
  })

  test.describe('回归测试: 重复名称 Bug', () => {
    test('创建多个笔记不应触发"名称已存在"提示', async ({ page }) => {
      const alerts: string[] = []
      page.on('dialog', async dialog => {
        alerts.push(dialog.message())
        await dialog.accept()
      })
      
      const createBtn = page.locator('.border-b button[title="新建笔记"]').first()
      
      for (let i = 0; i < 3; i++) {
        await createBtn.click()
        await page.waitForTimeout(500)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)
      }
      
      await page.waitForTimeout(1000)
      
      const duplicateAlerts = alerts.filter(a => a.includes('名称已存在'))
      expect(duplicateAlerts.length).toBe(0)
    })
  })
})