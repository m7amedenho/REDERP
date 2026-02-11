import { api } from "../axios";


export enum InventoryDocType {
  Receiving = 1,
  Transfer = 2,
  IssueToRep = 3,
  Sale = 4,
  CustomerReturn = 5,
  RepReturn = 6,
  Adjustment = 7,
  StockCount = 8,
}

export type IdResponse = { id: string };

export type Warehouse = {
  id: string;
  code: string;
  name: string;
  type: number; // 1 fixed, 2 mobile
  orgUnitId: string;
  ownerUserId?: string | null;
  ownerRepCode?: string | null;
  isActive: boolean;
};

export type InventoryDoc = {
  id: string;
  docType: number;
  status: number;
  number: string;
  docDateUtc: string;
  orgUnitId: string;
  fromWarehouseId?: string | null;
  toWarehouseId?: string | null;
  externalRef?: string | null;
  notes?: string | null;
  salesRepUserId?: string | null;
  salesRepCode?: string | null;
  lines: Array<{
    id: string;
    productId: string;
    qtyBase: number;
    unitLabel?: string | null;
    qtyInUnit?: number | null;
    lotCode?: string | null;
    expiryDate?: string | null;
    unitCost?: number | null;
  }>;
};

export type StockCountSession = {
  id: string;
  orgUnitId: string;
  warehouseId: string;
  status: number;
  snapshotAtUtc: string;
  createdAtUtc: string;
  createdByUserId?: string | null;
  postedAtUtc?: string | null;
  postedByUserId?: string | null;
  lines: Array<{
    id: string;
    productId: string;
    countedQtyBase: number;
    lotCode?: string | null;
    expiryDate?: string | null;
  }>;
};

export type BarcodeResponse = {
  token: string;
  zpl: string;
  productId: string;
  productCode: string;
  productName: string;
  repCode: string;
  lotCode?: string | null;
  expiryDate?: string | null;
  sourceWarehouseId: string;
  targetWarehouseId: string;
  salesRepUserId?: string | null;
  createdAtUtc: string;
};

export const inventoryApi = {
  // Warehouses
  async warehouses(orgUnitId: string) {
    const r = await api.get<Warehouse[]>("/inventory/warehouses", { params: { orgUnitId } });
    return r.data;
  },
  async createWarehouse(payload: { orgUnitId: string; code: string; name: string; type: number }) {
    const r = await api.post("/inventory/warehouses/create", payload);
    return r.data;
  },
  async ensureMobileWarehouse(payload: { orgUnitId: string; repUserId: string; repCode: string }) {
    const r = await api.post("/inventory/warehouses/mobile/ensure", payload);
    return r.data;
  },

  // Docs
  async createDoc(payload: {
    orgUnitId: string;
    docType: number;
    fromWarehouseId?: string | null;
    toWarehouseId?: string | null;
    salesRepUserId?: string | null;
    salesRepCode?: string | null;
    externalRef?: string | null;
    notes?: string | null;
  }) {
    const r = await api.post<IdResponse>("/inventory/docs/create", payload);
    return r.data;
  },
  async addDocLine(docId: string, payload: {
    productId: string;
    qtyBase: number;
    unitLabel?: string | null;
    qtyInUnit?: number | null;
    lotCode?: string | null;
    expiryDate?: string | null;
    unitCost?: number | null;
  }) {
    const r = await api.post(`/inventory/docs/${docId}/lines`, payload);
    return r.data;
  },
  async getDoc(docId: string) {
    const r = await api.get<InventoryDoc>(`/inventory/docs/${docId}`);
    return r.data;
  },
  async postDoc(docId: string) {
    const r = await api.post(`/inventory/docs/${docId}/post`);
    return r.data;
  },

  // Stock
  async stockBalance(params: { orgUnitId: string; warehouseId: string; productId: string }) {
    const r = await api.get("/inventory/stock/balance", { params });
    return r.data as any[];
  },
  async stockLayers(params: { orgUnitId: string; warehouseId: string; productId: string }) {
    const r = await api.get("/inventory/stock/layers", { params });
    return r.data as any[];
  },
  async itemCard(params: { orgUnitId: string; warehouseId: string; productId: string; fromUtc?: string; toUtc?: string }) {
    const r = await api.get("/inventory/stock/item-card", { params });
    return r.data as any[];
  },

  // Reports
  async reportOnHand(params: { orgUnitId: string; warehouseId?: string; productId?: string }) {
    const r = await api.get("/inventory/reports/onhand", { params });
    return r.data as any[];
  },
  async reportValuation(params: { orgUnitId: string; warehouseId?: string }) {
    const r = await api.get("/inventory/reports/valuation", { params });
    return r.data as any[];
  },
  async reportExpiry(params: { orgUnitId: string; warehouseId?: string; days?: number }) {
    const r = await api.get("/inventory/reports/expiry", { params });
    return r.data as any[];
  },
  async reportLedger(params: { orgUnitId: string; warehouseId?: string; productId?: string; fromUtc?: string; toUtc?: string }) {
    const r = await api.get("/inventory/reports/ledger", { params });
    return r.data as any[];
  },
  async reportRepStock(params: { orgUnitId: string; repUserId?: string }) {
    const r = await api.get("/inventory/reports/rep-stock", { params });
    return r.data as any[];
  },

  // StockCount
  async createCount(payload: { orgUnitId: string; warehouseId: string; snapshotAtUtc?: string | null }) {
    const r = await api.post<IdResponse>("/inventory/counts/create", payload);
    return r.data;
  },
  async getCount(sessionId: string) {
    const r = await api.get<StockCountSession>(`/inventory/counts/${sessionId}`);
    return r.data;
  },
  async addCountLine(sessionId: string, payload: { productId: string; countedQtyBase: number; lotCode?: string | null; expiryDate?: string | null }) {
    const r = await api.post(`/inventory/counts/${sessionId}/lines`, payload);
    return r.data;
  },
  async postCount(sessionId: string) {
    const r = await api.post<IdResponse>(`/inventory/counts/${sessionId}/post`);
    return r.data;
  },

  // Barcodes
  async createRepPackageBarcode(payload: {
    orgUnitId: string;
    productId: string;
    productName: string;
    productCode: string;
    repCode: string;
    sourceWarehouseId: string;
    targetWarehouseId: string;
    lotCode?: string | null;
    expiryDate?: string | null;
    salesRepUserId?: string | null;
  }) {
    const r = await api.post<BarcodeResponse>("/inventory/barcodes/rep-package", payload);
    return r.data;
  },
  async getBarcode(token: string) {
    const r = await api.get<BarcodeResponse>(`/inventory/barcodes/${token}`);
    return r.data;
  },
};
