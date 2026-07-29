import { test, expect } from "@playwright/test";
import { createTestAdminClient } from "./helpers/db";

test.describe("Javne recenzije", () => {
  const authorName = `PW Test Reviewer ${Date.now()}`;

  test.afterAll(async () => {
    const supabase = createTestAdminClient();
    await supabase.from("reviews").delete().eq("author_name", authorName);
  });

  test("recenzija ide na odobrenje i pojavljuje se na sajtu tek nakon što je admin odobri", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('input[name="author_name"]').scrollIntoViewIfNeeded();
    await page.fill('input[name="author_name"]', authorName);
    await page.click('button[aria-label="4 od 5 zvjezdica"]');
    await page.fill('textarea[name="body"]', "Automatizovana provjera toka recenzija.");
    await page.click('button:has-text("Pošaljite recenziju")');
    await expect(page.getByText("Hvala Vam na recenziji")).toBeVisible();

    await page.goto("/");
    await expect(page.getByText(authorName)).toHaveCount(0);

    await page.goto("/admin/login");
    await page.fill('input[name="email"]', process.env.PLAYWRIGHT_ADMIN_EMAIL!);
    await page.fill('input[name="password"]', process.env.PLAYWRIGHT_ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");

    await page.goto("/admin/recenzije");
    const pendingRow = page
      .getByTestId("reviews-pending")
      .locator("tr", { hasText: authorName });
    await expect(pendingRow).toBeVisible();
    await pendingRow.getByRole("button", { name: "Odobri" }).click();
    await expect(pendingRow).toHaveCount(0);

    await page.goto("/");
    await expect(page.getByText(authorName)).toBeVisible();
  });
});
