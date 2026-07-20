"use client";

export function PrintButton() {
  return (
    <button
      className="print:hidden rounded-md bg-bronze-dark px-4 py-2 text-sm font-semibold text-parchment hover:bg-bronze"
      onClick={() => window.print()}
    >
      Print
    </button>
  );
}
