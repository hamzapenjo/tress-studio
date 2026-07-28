import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD!;

test.beforeAll(() => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "PLAYWRIGHT_ADMIN_EMAIL / PLAYWRIGHT_ADMIN_PASSWORD nisu postavljeni u .env.local"
    );
  }
});

test("neulogovan korisnik se preusmjerava na login sa zaštićene admin rute", async ({
  page,
}) => {
  await page.goto("/admin/termini");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("pogrešna lozinka prikazuje grešku i ne ulazi u panel", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', "pogresna-lozinka-123");
  await page.click('button[type="submit"]');

  await expect(page.getByText(/Pogrešan email ili lozinka/i)).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("ispravna prijava vodi na dashboard i odjava vraća na login", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.fill('input[name="email"]', ADMIN_EMAIL);
  await page.fill('input[name="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole("heading", { name: "Pregled" })).toBeVisible();

  await page.getByRole("button", { name: "Odjava" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);

  await page.goto("/admin/termini");
  await expect(page).toHaveURL(/\/admin\/login/);
});
