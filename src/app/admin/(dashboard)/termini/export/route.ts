import { NextRequest, NextResponse } from "next/server";
import writeExcelFile from "write-excel-file/node";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/database.types";

export const runtime = "nodejs";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  na_cekanju: "Na čekanju",
  potvrdjeno: "Potvrđeno",
  zavrseno: "Završeno",
  otkazano: "Otkazano",
};

const HEADER_ROW = [
  { value: "Datum", fontWeight: "bold" as const },
  { value: "Vrijeme", fontWeight: "bold" as const },
  { value: "Klijent", fontWeight: "bold" as const },
  { value: "Telefon", fontWeight: "bold" as const },
  { value: "Usluga", fontWeight: "bold" as const },
  { value: "Frizer", fontWeight: "bold" as const },
  { value: "Status", fontWeight: "bold" as const },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get("status") ?? undefined;
  const od = searchParams.get("od") ?? undefined;
  const doDatuma = searchParams.get("do") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const status =
    rawStatus && rawStatus in STATUS_LABELS
      ? (rawStatus as AppointmentStatus)
      : undefined;

  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select(
      "appointment_date, appointment_time, status, customers(name, phone), services(name), staff(name)"
    )
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (status) query = query.eq("status", status);
  if (od) query = query.gte("appointment_date", od);
  if (doDatuma) query = query.lte("appointment_date", doDatuma);

  const { data } = await query;
  const search = q?.trim().toLowerCase();
  const appointments = search
    ? (data ?? []).filter(
        (a) =>
          a.customers?.name?.toLowerCase().includes(search) ||
          a.customers?.phone?.toLowerCase().includes(search)
      )
    : data ?? [];

  const rows = [
    HEADER_ROW,
    ...appointments.map((appointment) => [
      { value: appointment.appointment_date, type: String },
      { value: appointment.appointment_time, type: String },
      { value: appointment.customers?.name ?? "", type: String },
      { value: appointment.customers?.phone ?? "", type: String },
      { value: appointment.services?.name ?? "", type: String },
      { value: appointment.staff?.name ?? "-", type: String },
      { value: STATUS_LABELS[appointment.status], type: String },
    ]),
  ];

  const buffer = await writeExcelFile(rows).toBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="termini.xlsx"`,
    },
  });
}
