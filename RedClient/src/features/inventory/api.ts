const API = process.env.NEXT_PUBLIC_API_BASE || "https://localhost:7000";

async function http<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      // include auth bearer if you store token in cookies or local storage
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const inventoryApi = {
  warehouses: (orgUnitId: string) =>
    http<any[]>(`/api/inventory/warehouses?orgUnitId=${orgUnitId}`),

  createDoc: (body: any) => http(`/api/inventory/docs/create`, { method: "POST", body: JSON.stringify(body) }),
  addDocLine: (docId: string, body: any) => http(`/api/inventory/docs/${docId}/lines`, { method: "POST", body: JSON.stringify(body) }),
  postDoc: (docId: string) => http(`/api/inventory/docs/${docId}/post`, { method: "POST" }),

  itemCard: (orgUnitId: string, warehouseId: string, productId: string) =>
    http(`/api/inventory/stock/item-card?orgUnitId=${orgUnitId}&warehouseId=${warehouseId}&productId=${productId}`),

  createRepPackageBarcode: (body: any) =>
    http(`/api/inventory/barcodes/rep-package`, { method: "POST", body: JSON.stringify(body) }),
};
