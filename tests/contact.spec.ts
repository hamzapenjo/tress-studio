import { test, expect } from "@playwright/test";
import { createTestAdminClient } from "./helpers/db";

test.describe("Kontakt forma", () => {
  const contact = `pw-test-${Date.now()}@example.com`;

  test.afterAll(async () => {
    const supabase = createTestAdminClient();
    await supabase.from("messages").delete().eq("contact", contact);
  });

  test("obavezna polja sprječavaju slanje prazne forme", async ({ page }) => {
    await page.goto("/kontakt");
    await page.click('button[type="submit"]');

    const nameValid = await page
      .locator('input[name="name"]')
      .evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(nameValid).toBe(false);

    // Forma nije poslana - i dalje smo na istoj stranici bez poruke o uspjehu.
    await expect(
      page.getByText("Vaša poruka je poslana. Odgovorićemo Vam u najkraćem roku.")
    ).not.toBeVisible();
  });

  test("uspješno slanje poruke prikazuje potvrdu i snima poruku u bazu", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    await page.fill('input[name="name"]', "Playwright Test");
    await page.fill('input[name="contact"]', contact);
    await page.fill(
      'textarea[name="body"]',
      "Automatizovana provjera kontakt forme."
    );
    await page.click('button[type="submit"]');

    await expect(
      page.getByText("Vaša poruka je poslana. Odgovorićemo Vam u najkraćem roku.")
    ).toBeVisible();

    const supabase = createTestAdminClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("contact", contact)
      .maybeSingle();

    expect(data?.name).toBe("Playwright Test");
  });
});
