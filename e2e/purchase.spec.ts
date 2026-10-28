import { test, expect, type Page } from "@playwright/test";
async function control(page: Page, name: string) {
  await page.evaluate((key) => {
    const controls = (
      window as unknown as { purchaseTest: Record<string, () => void> }
    ).purchaseTest;
    controls[key]();
  }, name);
}
async function loginFromCourse(page: Page) {
  await page.goto("/course/demo?tier=recorded");
  await page.getByRole("button", { name: "Ingresá para pagar" }).click();
  await expect(page).toHaveURL(/returnTo=/);
  await page
    .getByRole("textbox", { name: "Correo electrónico" })
    .fill("student@example.com");
  await page.getByLabel("Contraseña").fill("password123");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(page).toHaveURL(/course\/demo.*tier=recorded/);
}
test("purchase, fail, reopen, pass, lose access and purchase a fresh run", async ({
  page,
}) => {
  await loginFromCourse(page);
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await expect(
    page.getByRole("heading", { name: "Estamos verificando tu pago" }),
  ).toBeVisible();
  await control(page, "approve");
  await page.getByRole("button", { name: "Ir a mi panel" }).click();
  await page.getByRole("link", { name: "Continuar curso" }).click();
  await expect(
    page.getByRole("link", { name: "Grabación de la clase" }),
  ).toBeVisible();
  await page.getByLabel("Incorrecta", { exact: true }).check();
  await page
    .getByLabel("Entiendo que aprobar termina mi acceso a los contenidos.")
    .check();
  await page.getByRole("button", { name: "Enviar examen" }).click();
  await expect(
    page.getByText("Intento 1: No aprobado", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar examen" })).toHaveCount(
    0,
  );
  await control(page, "reopen");
  await page.getByLabel("Correcta", { exact: true }).check();
  await page.getByRole("button", { name: "Enviar examen" }).click();
  await expect(
    page.getByRole("heading", { name: "Esta cursada no tiene acceso activo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Grabación de la clase" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Volver a mis cursos" }).click();
  await page.getByRole("link", { name: "Comprar otra cursada" }).click();
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await control(page, "approve");
  await page.getByRole("button", { name: "Ir a mi panel" }).click();
  await expect(page.getByText("Cursada 2", { exact: false })).toBeVisible();
});
test("active students cannot start another purchase; refund removes content access", async ({
  page,
}) => {
  await loginFromCourse(page);
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await control(page, "approve");
  await page.getByRole("button", { name: "Ir a mi panel" }).click();
  await page.getByRole("link", { name: "Continuar curso" }).click();
  await page.evaluate(() => {
    history.pushState({}, "", "/course/demo");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(
    page.getByRole("button", { name: "Pagar con Mercado Pago" }),
  ).toHaveCount(0);
  await page.evaluate(() => {
    history.pushState({}, "", "/dashboard/enrollments/run1");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await control(page, "refund");
  await expect(
    page.getByRole("heading", { name: "Esta cursada no tiene acceso activo" }),
  ).toBeVisible();
});
test("expired, review, and foreign orders expose no checkout resume link", async ({
  page,
}) => {
  await loginFromCourse(page);
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await control(page, "expired");
  await expect(
    page.getByRole("heading", { name: "El checkout venció" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continuar con Mercado Pago" }),
  ).toHaveCount(0);
  await control(page, "review");
  await expect(
    page.getByRole("heading", { name: "Tu pago está siendo revisado" }),
  ).toBeVisible();
});

test("foreign order is hidden and checkout destination survives login", async ({
  page,
}) => {
  await page.goto("/checkout/foreign");
  await expect(page).toHaveURL(/login.*returnTo=/);
  await page
    .getByRole("textbox", { name: "Correo electrónico" })
    .fill("student@example.com");
  await page.getByLabel("Contraseña").fill("password123");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No encontramos esta compra" }),
  ).toBeVisible();
});
test("started live cohorts cannot be purchased while recorded tier remains available", async ({
  page,
}) => {
  await loginFromCourse(page);
  await page.getByRole("button", { name: "En vivo", exact: true }).click();
  await control(page, "startCohort");
  await expect(
    page.getByRole("button", { name: "No hay cupos disponibles" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Grabado", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pagar con Mercado Pago" }),
  ).toBeEnabled();
});
