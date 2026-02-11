"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Printer,
  Download,
  Settings,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const barcodeTypes = [
  { value: "qr", label: "QR Code" },
  { value: "code128", label: "Code 128" },
  { value: "ean13", label: "EAN-13" },
  { value: "ean8", label: "EAN-8" },
  { value: "upc", label: "UPC" },
];

const barcodes = [
  {
    id: "1",
    code: "PRD001",
    name: "بذور الخيار الهجين",
    type: "قر",
    created: "2024-01-15",
  },
  {
    id: "2",
    code: "PRD002",
    name: "مبيد الآفات العضوي",
    type: "code128",
    created: "2024-01-16",
  },
  {
    id: "3",
    code: "PRD003",
    name: "سماد NPK متوازن",
    type: "qr",
    created: "2024-01-17",
  },
];

export default function BarcodePrintPage() {
  const [selectedType, setSelectedType] = useState("qr");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [copies, setCopies] = useState(1);

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">طباعة الباركود</h1>
            <p className="text-muted-foreground">
              إنشاء وطباعة باركود للمنتجات
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/print/barcode/customize">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              تخصيص متقدم
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* نموذج إنشاء باركود */}
        <Card>
          <CardHeader>
            <CardTitle>إنشاء باركود جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcodeValue">القيمة / الكود</Label>
              <Input
                id="barcodeValue"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                placeholder="أدخل الكود أو القيمة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcodeType">نوع الباركود</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barcodeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="copies">عدد النسخ</Label>
              <Input
                id="copies"
                type="number"
                min="1"
                value={copies}
                onChange={(e) => setCopies(parseInt(e.target.value))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="flex-1 gap-2">
                <Plus className="w-4 h-4" />
                إنشاء باركود
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" />
                معاينة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* معاينة */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة الباركود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[300px] border-2 border-dashed rounded-lg">
              <div className="text-center">
                <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  ستظهر معاينة الباركود هنا
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  أدخل القيمة واختر النوع لإنشاء الباركود
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="flex-1 gap-2">
                <Printer className="w-4 h-4" />
                طباعة
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                تحميل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الباركودات المحفوظة */}
      <Card>
        <CardHeader>
          <CardTitle>الباركودات المحفوظة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {barcodes.map((barcode) => (
              <div
                key={barcode.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium">{barcode.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline">{barcode.code}</Badge>
                      <span>•</span>
                      <span>{barcode.created}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
