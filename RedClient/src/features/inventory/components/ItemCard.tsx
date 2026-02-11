"use client";

type Props = {
  productName: string;
  productImageUrl?: string;
  onHand: number;
  layers: Array<{ qtyRemaining: number; unitCost: number; lotCode?: string; expiryDate?: string }>;
  ledger: Array<{ dateUtc: string; docType: string; docNo: string; direction: string; qty: number; unitCost: number; totalCost: number; lotCode?: string; expiryDate?: string }>;
};

export function ItemCard(props: Props) {
  return (
    <div className="rounded-2xl shadow p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
          {props.productImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.productImageUrl} alt={props.productName} className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div>
          <div className="text-xl font-semibold">{props.productName}</div>
          <div className="text-sm text-gray-500">On Hand: <span className="font-semibold">{props.onHand}</span></div>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">FIFO Layers</div>
        <div className="overflow-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Cost</th>
                <th className="p-2 text-left">Lot</th>
                <th className="p-2 text-left">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {props.layers.map((l, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{l.qtyRemaining}</td>
                  <td className="p-2">{l.unitCost}</td>
                  <td className="p-2">{l.lotCode ?? "-"}</td>
                  <td className="p-2">{l.expiryDate ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="font-semibold mb-2">Ledger</div>
        <div className="overflow-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Doc</th>
                <th className="p-2 text-left">Dir</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Cost</th>
                <th className="p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {props.ledger.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{new Date(r.dateUtc).toLocaleString()}</td>
                  <td className="p-2">{r.docType} / {r.docNo}</td>
                  <td className="p-2">{r.direction}</td>
                  <td className="p-2">{r.qty}</td>
                  <td className="p-2">{r.unitCost}</td>
                  <td className="p-2">{r.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
