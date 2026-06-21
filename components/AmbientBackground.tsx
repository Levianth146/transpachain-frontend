"use client";

export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg-base"
      aria-hidden
    >
      <div
        className="animate-drift1 absolute -left-[12%] -top-[12%] h-[720px] w-[720px] rounded-full opacity-[0.46] blur-[110px]"
        style={{
          background: "radial-gradient(circle, #4338ca, transparent 68%)",
        }}
      />
      <div
        className="animate-drift2 absolute -right-[14%] top-[8%] h-[640px] w-[640px] rounded-full opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent 68%)",
        }}
      />
      <div
        className="animate-drift3 absolute bottom-[-12%] left-[28%] h-[560px] w-[560px] rounded-full opacity-[0.28] blur-[90px]"
        style={{
          background: "radial-gradient(circle, #0ea5e9, transparent 68%)",
        }}
      />
      <div
        className="animate-drift4 absolute right-[16%] top-[48%] h-[400px] w-[400px] rounded-full opacity-[0.18] blur-[80px]"
        style={{
          background: "radial-gradient(circle, #059669, transparent 68%)",
        }}
      />
    </div>
  );
}
