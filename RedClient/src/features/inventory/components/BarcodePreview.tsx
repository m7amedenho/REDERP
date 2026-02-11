"use client";

export function BarcodePreview({ zpl }: { zpl: string }) {
  const download = () => {
    const blob = new Blob([zpl], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "label.zpl";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl shadow p-4 space-y-leading">
      <div className="font-semibold">ZPL Output</div>
      <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto max-h-96">{zpl}</pre>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={download}>
        Download .ZPL (send to Zebra)
      </button>
    </div>
  );
}
