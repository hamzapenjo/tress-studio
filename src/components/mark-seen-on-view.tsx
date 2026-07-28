"use client";

import { useEffect } from "react";
import { markAppointmentsSeen } from "@/app/admin/(dashboard)/termini/actions";

export function MarkSeenOnView() {
  useEffect(() => {
    markAppointmentsSeen();
  }, []);

  return null;
}
