"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center">
      <Spinner />
    </div>
  );
}