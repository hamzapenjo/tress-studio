import { test, expect } from "@playwright/test";
import { createTestAdminClient } from "./helpers/db";

// Bira prvi radni dan (Pon-Pet) koji je najmanje 14 dana u buducnosti,
// da se izbjegnu konflikti sa postojecim terminima i sa "danas" ivicnim slucajevima.
function nextWorkingDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

test.describe("Zakazivanje termina", () => {
  const phone = `+38762${Date.now().toString().slice(-6)}`;

  test.afterAll(async () => {
    const supabase = createTestAdminClient();
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (customer) {
      await supabase.from("appointments").delete().eq("customer_id", customer.id);
      await supabase.from("customers").delete().eq("id", customer.id);
    }
  });

  test("kompletira javnu rezervaciju termina i prikazuje potvrdu na čekanju", async ({
    page,
  }) => {
    const targetDate = nextWorkingDate();
    const targetIso = toISO(targetDate);
    const today = new Date();
    const monthsForward =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    await page.goto("/zakazivanje");

    // Korak: usluga
    await page.getByTestId("service-select").getByRole("button").click();
    await page.getByRole("option").first().click();
    await page.getByRole("button", { name: "Dalje" }).click();

    // Korak: osoblje (opcionalan, preskace se ako postoji)
    if (await page.locator("label", { hasText: "Osoblje" }).isVisible()) {
      await page.getByRole("button", { name: "Dalje" }).click();
    }

    // Korak: termin (datum + vrijeme su spojeni u jedan korak)
    await page.getByTestId("date-picker").getByRole("button").first().click();
    for (let i = 0; i < monthsForward; i++) {
      await page.getByTestId("date-next-month").click();
    }
    await page.getByTestId(`date-day-${targetIso}`).click();

    // 10:00 - sigurno unutar radnog vremena 09-17
    const slot = page.getByRole("button", { name: "10:00", exact: true });
    await expect(slot).toBeEnabled();
    await slot.click();
    await page.getByRole("button", { name: "Dalje" }).click();

    // Korak: kontakt podaci
    await page.fill('input[name="name"]', "Playwright Test");
    await page.fill('input[name="phone"]', phone);
    await page.getByRole("button", { name: "Potvrdite termin" }).click();

    await expect(
      page.getByText(
        "Vaš zahtjev za termin je poslan. Kontaktiraćemo Vas uskoro radi potvrde."
      )
    ).toBeVisible();

    const supabase = createTestAdminClient();
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    expect(customer).toBeTruthy();

    const { data: appointment } = await supabase
      .from("appointments")
      .select("status, appointment_date, appointment_time")
      .eq("customer_id", customer!.id)
      .maybeSingle();

    expect(appointment?.status).toBe("na_cekanju");
    expect(appointment?.appointment_date).toBe(targetIso);
  });
});
