import { api } from "../axios";


export type CatalogProduct = {
  id: string;
  code: string;
  name: string;
  imageUrl?: string | null;
  isLotTracked: boolean;
  isExpiryTracked: boolean;
  baseUnitId: string;
  maxDiscountPercent: number;
};

export const catalogApi = {
  async products(q?: string) {
    const r = await api.get<CatalogProduct[]>("/catalog/products", { params: q ? { q } : {} });
    return r.data;
  },
  async product(id: string) {
    const r = await api.get<CatalogProduct>(`/catalog/products/${id}`);
    return r.data;
  },
};

export async function searchProducts(q?: string) {
  const res = await api.get<CatalogProduct[]>("/catalog/products", {
    params: q ? { q } : undefined,
  });
  return res.data ?? [];
}

export async function getProduct(id: string) {
  const res = await api.get<CatalogProduct>(`/catalog/products/${id}`);
  return res.data;
}

export type CreateProductRequest = {
  code: string;
  name: string;
  imageUrl?: string | null;
  isLotTracked: boolean;
  isExpiryTracked: boolean;
  baseUnitId: string;
  maxDiscountPercent: number;
};

export async function createProduct(body: CreateProductRequest) {
  const res = await api.post("/catalog/products/create", body);
  return res.data;
}

export enum PriceType {
  Supply = 1,
  Sale = 2,
  // زود اللي عندك لو فيه أنواع تانية
}

export type UpsertPriceRequest = {
  productId: string;
  type: number; // PriceType
  amount: number;
  unitId?: string | null;
};

export async function upsertPrice(body: UpsertPriceRequest) {
  const res = await api.post("/catalog/prices/upsert", body);
  return res.data;
}

export type CreateUnitRequest = { name: string; symbol: string };
export async function createUnit(body: CreateUnitRequest) {
  const res = await api.post("/catalog/units/create", body);
  return res.data;
}

export type CreateConversionRequest = {
  productId: string;
  fromUnitId: string;
  toUnitId: string;
  factor: number;
};
export async function createConversion(body: CreateConversionRequest) {
  const res = await api.post("/catalog/units/conversion", body);
  return res.data;
}