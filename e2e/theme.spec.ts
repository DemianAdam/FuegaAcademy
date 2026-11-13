import { test, expect, type Page } from '@playwright/test';

async function selectTheme(page: Page, label: string) {
  await page.getByRole('button', { name: 'Cambiar tema' }).filter({ visible: true }).first().click();
  await page.getByRole('menuitemradio', { name: label, exact: true }).click();
}
async function setup(page: Page, theme: string) {
  await page.addInitScript(value => localStorage.setItem('fuega-theme', value), theme);
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

test('pre-paint bootstrap works without React, and invalid preferences follow the OS', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.setItem('fuega-theme', 'invalid'));
  await page.route('**/main.tsx', route => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass('dark');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
  await expect(page.locator('#root')).toBeEmpty();
});

test('selection, keyboard radio semantics, reload, OS and cross-tab synchronization', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/courses');
  await page.getByRole('button', { name: 'Cambiar tema' }).filter({ visible: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitemradio', { name: 'Sistema' })).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('menuitemradio', { name: 'Oscuro' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveClass('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveClass('dark');
  const second = await context.newPage();
  await second.goto('/courses');
  await selectTheme(second, 'Claro');
  await expect(page.locator('html')).toHaveClass('light');
  await second.evaluate(() => localStorage.removeItem('fuega-theme'));
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
  await page.getByRole('button', { name: 'Cambiar tema' }).filter({ visible: true }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Sistema' })).toHaveAttribute('aria-checked', 'true');
});

for (const theme of ['light', 'dark']) {
  for (const width of [390, 1440]) {
    test(`${theme} ${width}: public, student and admin screen coverage`, async ({ page }, testInfo) => {
      await setup(page, theme);
      await page.setViewportSize({ width, height: 960 });
      test.setTimeout(90000);
      const failures: string[] = [];
      page.on('pageerror', error => failures.push(error.message));
      for (const [name, path] of [
        ['home', '/'], ['courses', '/courses'], ['teachers', '/teachers'],
        ['course', '/course/demo'], ['auth', '/login'],
        ['dashboard', '/dashboard?role=student'], ['checkout', '/checkout/order?role=student'],
        ['admin', '/admin?role=admin'], ['classroom', '/dashboard/enrollments/run1?role=student&scenario=classroom'], ['editor', '/admin/courses/new?role=admin'],
      ]) {
        await page.goto(path);
        await expect(page.locator('html')).toHaveClass(theme);
        await expect(page.getByRole('button', { name: 'Cambiar tema' }).filter({ visible: true })).toHaveCount(1);
        const selectorBox = await page.getByRole('button', { name: 'Cambiar tema' }).filter({ visible: true }).boundingBox();
        expect(selectorBox!.x + selectorBox!.width).toBeLessThanOrEqual(width);
        await expect(page.locator('body')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(11, 12, 14)' : 'rgb(251, 249, 244)');
        await expect(page.getByText('Something went wrong', { exact: true })).toHaveCount(0);
        if (name === 'teachers') await expect(page.getByRole('heading', { name: 'Ana Pérez' })).toBeVisible();
        // Trigger viewport animations before collecting full-page evidence.
        const height = await page.locator('body').evaluate(element => element.scrollHeight);
        for (let y = 0; y < height; y += 700) {
          await page.evaluate(value => window.scrollTo(0, value), y);
          await page.waitForTimeout(180);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(850);
        await assertRenderedContrast(page);
        await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true, animations: 'disabled' });
      }
      expect(failures).toEqual([]);
    });
  }
  test(`${theme}: semantic text and control contrast`, async ({ page }) => {
    await setup(page, theme);
    await page.goto('/login');
    const ratios = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      function color(token: string) {
        return style.getPropertyValue('--' + token).trim();
      }
      function lum(hex: string) {
        const rgb = hex.replace('#', '').match(/../g)!.map(v => parseInt(v, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      }
      return [
        ['on-surface', 'surface', 4.5], ['on-surface-variant', 'surface-container-highest', 4.5],
        ['on-action', 'action', 4.5], ['on-primary-container', 'primary-container', 4.5],
        ['on-secondary-container', 'secondary-container', 4.5],
        ['error', 'card', 4.5], ['warning', 'warning-container', 4.5], ['success', 'success-container', 4.5],
        ['outline', 'card', 3], ['focus', 'surface', 3],
      ].map(([fg, bg, minimum]) => {
        const a = lum(color(String(fg))), b = lum(color(String(bg)));
        return { pair: `${fg}/${bg}`, ratio: (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05), minimum: Number(minimum) };
      });
    });
    for (const entry of ratios) expect(entry.ratio, entry.pair).toBeGreaterThanOrEqual(entry.minimum);
    const button = page.getByRole('button', { name: 'Ingresar', exact: true });
    await expect(button).toHaveCSS('background-color', theme === 'dark' ? 'rgb(138, 180, 248)' : 'rgb(204, 255, 0)');
    await expect(button).toHaveCSS('color', theme === 'dark' ? 'rgb(16, 28, 46)' : 'rgb(22, 30, 0)');
    if (theme === 'dark') await expect(button).toHaveCSS('box-shadow', 'none');
  });
}

for (const theme of ['light', 'dark']) {
  test(`${theme}: portals, invalid/disabled controls and keyboard focus`, async ({ page }, testInfo) => {
    await setup(page, theme);
    await page.goto('/?scenario=states');
    await expect(page.getByLabel('Correo')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByLabel('Deshabilitado')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Guardando' })).toBeDisabled();
    await page.getByLabel('Nombre', { exact: true }).focus();
    await expect(page.getByLabel('Nombre', { exact: true })).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.animate-spin').first()).toHaveCSS('animation-duration', '1e-05s');
    await page.getByRole('button', { name: 'Más información' }).click();
    await expect(page.getByText('Contenido de ayuda.')).toBeVisible();
    await assertRenderedContrast(page);
    await page.screenshot({ path: testInfo.outputPath('states.png'), fullPage: true });
    await page.getByRole('button', { name: 'Abrir diálogo' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCSS('color', theme === 'dark' ? 'rgb(232, 234, 237)' : 'rgb(27, 28, 25)');
    await page.screenshot({ path: testInfo.outputPath('dialog.png') });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Abrir diálogo' })).toBeFocused();
    await selectTheme(page, theme === 'dark' ? 'Claro' : 'Oscuro');
    await expect(page.locator('html')).toHaveClass(theme === 'dark' ? 'light' : 'dark');
  });
  test(`${theme}: payment status and admin warning surfaces`, async ({ page }, testInfo) => {
    await setup(page, theme);
    await page.goto('/checkout/order?role=student');
    for (const status of ['approve', 'review', 'rejected', 'expired']) {
      await page.evaluate(name => {
        (window as unknown as { purchaseTest: Record<string, () => void> }).purchaseTest[name]();
      }, status);
      await page.screenshot({ path: testInfo.outputPath(`${status}.png`) });
      await expect(page.locator('main section').last()).toBeVisible();
    }
    await page.goto('/admin?role=admin');
    await page.getByRole('tab', { name: 'Revisiones' }).click();
    await expect(page.getByText('Requiere revisión', { exact: true })).toBeVisible();
    await assertRenderedContrast(page);
    await page.screenshot({ path: testInfo.outputPath('payment-review.png'), fullPage: true });
  });
}

// Measure actual CSS colors and ancestor alpha compositing on semantic UI surfaces.
// Images/gradients are inspected in the screenshots rather than approximated here.
async function assertRenderedContrast(page: Page) {
  const failures = await page.locator('.text-on-surface-variant, .text-on-secondary-container, .text-promo-muted, .text-warning, .text-success, .text-error, [role="alert"], button.bg-action').evaluateAll(elements => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    function rgba(value: string): number[] {
      ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
    }
    function blend(fg: number[], bg: number[]) { return fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3])); }
    function lum(rgb: number[]) {
      const linear = rgb.map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    }
    return elements.flatMap(element => {
      if (!(element instanceof HTMLElement) || !element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) || element.matches(':disabled') || !element.textContent?.trim() || element.classList.contains('material-symbols-outlined')) return [];
      const ancestors: Element[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) ancestors.unshift(node);
      let bg = [255, 255, 255]; let opacity = 1;
      for (const node of ancestors) {
        const style = getComputedStyle(node);
        const layer = rgba(style.backgroundColor); layer[3] *= Number(style.opacity);
        bg = blend(layer, bg); opacity *= Number(style.opacity);
      }
      const fg = rgba(getComputedStyle(element).color); fg[3] *= opacity;
      const a = lum(blend(fg, bg)), b = lum(bg);
      const ratio = (Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05);
      return ratio < 4.5 ? [{ text: element.textContent.trim().slice(0, 65), ratio }] : [];
    });
  });
  expect(failures, 'Rendered text contrast including opacity').toEqual([]);
}
