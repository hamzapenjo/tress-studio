"use client";

import { useEffect } from "react";
import { markMessagesRead } from "@/app/admin/(dashboard)/poruke/actions";

export function MarkMessagesRead() {
  useEffect(() => {
    markMessagesRead();
  }, []);

  return null;
}
