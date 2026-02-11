// src/app/dashboard/finance/daily-collections/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Printer,
  BarChart3,
  Clock,
  Calendar,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface Collection {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerType: "شركة" | "فرد" | "مشتل";
  amount: number;
  paymentMethod: "نقدي" | "شيك" | "تحويل" | "آجل";
  paymentDate: string;
  collectedBy: string;
  status: "مكتمل" | "معلق" | "ملغى";
  invoiceReference?: string;
  notes?: string;
}

interface CollectionSummary {
  date: string;
  totalAmount: number;
  cashAmount: number;
  checkAmount: number;
  transferAmount: number;
  collectionCount: number;
  collectedBy: string;
}

// بيانات ثابتة
const collectionsData: Collection[] = [
  {
    id: "1",
    receiptNumber: "RCP-2024-001",
    customerName: "شركة النور للتجارة",
    customerType: "شركة",
    amount: 15000,
    paymentMethod: "شيك",
    paymentDate: "2024-01-15",
    collectedBy: "أحمد محمود",
    status: "مكتمل",
    invoiceReference: "INV-001",
  },
  {
    id: "2",
    receiptNumber: "RCP-2024-002",
    customerName: "أحمد محمد",
    customerType: "فرد",
    amount: 5000,
    paymentMethod: "نقدي",
    paymentDate: "2024-01-15",
    collectedBy: "محمد علي",
    status: "مكتمل",
  },
  {
    id: "3",
    receiptNumber: "RCP-2024-003",
    customerName: "مشتل الورود",
    customerType: "مشتل",
    amount: 10000,
    paymentMethod: "تحويل",
    paymentDate: "2024-01-16",
    collectedBy: "فاطمة أحمد",
    status: "معلق",
    invoiceReference: "INV-002",
  },
  {
    id: "4",
    receiptNumber: "RCP-2024-004",
    customerName: "شركة الأمل للزراعة",
    customerType: "شركة",
    amount: 25000,
    paymentMethod: "شيك",
    paymentDate: "2024-01-16",
    collectedBy: "خالد سعيد",
    status: "مكتمل",
  },
  {
    id: "5",
    receiptNumber: "RCP-2024-005",
    customerName: "فاطمة علي",
    customerType: "فرد",
    amount: 3000,
    paymentMethod: "نقدي",
    paymentDate: "2024-01-17",
    collectedBy: "أحمد محمود",
    status: "مكتمل",
  },
];

const dailySummary: CollectionSummary[] = [
  {
    date: "2024-01-15",
    totalAmount: 20000,
    cashAmount: 5000,
    checkAmount: 15000,
    transferAmount: 0,
    collectionCount: 2,
    collectedBy: "أحمد محمود، محمد علي",
  },
  {
    date: "2024-01-16",
    totalAmount: 35000,
    cashAmount: 0,
    checkAmount: 25000,
    transferAmount: 10000,
    collectionCount: 2,
    collectedBy: "فاطمة أحمد، خالد سعيد",
  },
  {
    date: "2024-01-17",
    totalAmount: 3000,
    cashAmount: 3000,
    checkAmount: 0,
    transferAmount: 0,
    collectionCount: 1,
    collectedBy: "أحمد محمود",
  },
];

// المكونات UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// تعريف أعمدة جدول التحصيلات
const collectionColumns: ColumnDef<Collection>[] = [
  {
    accessorKey: "receiptNumber",
    header: "رقم الإيصال",
  },
  {
    accessorKey: "customerName",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "customerType",
    header: "نوع العميل",
    cell: ({ row }) => {
      const type = row.getValue("customerType") as string;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="font-medium text-green-600">
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "طريقة الدفع",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const variant =
        method === "نقدي"
          ? "default"
          : method === "شيك"
          ? "secondary"
          : method === "تحويل"
          ? "outline"
          : "destructive";
      return <Badge variant={variant}>{method}</Badge>;
    },
  },
  {
    accessorKey: "paymentDate",
    header: "تاريخ الدفع",
  },
  {
    accessorKey: "collectedBy",
    header: "تم التحصيل بواسطة",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مكتمل"
          ? "default"
          : status === "معلق"
          ? "secondary"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

// تعريف أعمدة جدول الملخص اليومي
const summaryColumns: ColumnDef<CollectionSummary>[] = [
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    accessorKey: "totalAmount",
    header: "الإجمالي",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <div>{amount.toLocaleString()} ج.م</div>;
    },
  },
  {
    accessorKey: "cashAmount",
    header: "نقدي",
    cell: ({ row }) => {
      const amount = row.getValue("cashAmount") as number;
      return amount > 0 ? (
        <div className="text-green-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "checkAmount",
    header: "شيكات",
    cell: ({ row }) => {
      const amount = row.getValue("checkAmount") as number;
      return amount > 0 ? (
        <div className="text-blue-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "transferAmount",
    header: "تحويلات",
    cell: ({ row }) => {
      const amount = row.getValue("transferAmount") as number;
      return amount > 0 ? (
        <div className="text-purple-600">{amount.toLocaleString()} ج.م</div>
      ) : null;
    },
  },
  {
    accessorKey: "collectionCount",
    header: "عدد التحصيلات",
    cell: ({ row }) => {
      const count = row.getValue("collectionCount") as number;
      return <div>{count} عملية</div>;
    },
  },
];

// مودال إضافة تحصيل
function AddCollectionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerType: "فرد" as "شركة" | "فرد" | "مشتل",
    amount: "",
    paymentMethod: "نقدي" as "نقدي" | "شيك" | "تحويل" | "آجل",
    paymentDate: new Date().toISOString().split("T")[0],
    invoiceReference: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إضافة تحصيل جديد:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة تحصيل جديد
          </DialogTitle>
          <DialogDescription>تسجيل عملية تحصيل جديدة</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">اسم العميل *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerType">نوع العميل</Label>
              <Select
                value={formData.customerType}
                onValueChange={(value: "شركة" | "فرد" | "مشتل") =>
                  setFormData({ ...formData, customerType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="فرد">فرد</SelectItem>
                  <SelectItem value="شركة">شركة</SelectItem>
                  <SelectItem value="مشتل">مشتل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: "نقدي" | "شيك" | "تحويل" | "آجل") =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقدي">نقدي</SelectItem>
                  <SelectItem value="شيك">شيك</SelectItem>
                  <SelectItem value="تحويل">تحويل بنكي</SelectItem>
                  <SelectItem value="آجل">آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">تاريخ الدفع *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceReference">رقم الفاتورة (اختياري)</Label>
            <Input
              id="invoiceReference"
              value={formData.invoiceReference}
              onChange={(e) =>
                setFormData({ ...formData, invoiceReference: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">حفظ التحصيل</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function DailyCollectionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const todayCollections = collectionsData.filter(
    (c) => c.paymentDate === selectedDate
  );

  const stats = [
    {
      title: "تحصيلات اليوم",
      value: todayCollections
        .reduce((sum, c) => sum + c.amount, 0)
        .toLocaleString(),
      description: "ج.م",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "عدد التحصيلات",
      value: todayCollections.length,
      description: "عملية تحصيل",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المتوسط اليومي",
      value: "28,000 ج.م",
      description: "متوسط 7 أيام",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المستهدف اليومي",
      value: "50,000 ج.م",
      description: "مكتمل 62%",
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const paymentMethodTotals = {
    نقدي: todayCollections
      .filter((c) => c.paymentMethod === "نقدي")
      .reduce((sum, c) => sum + c.amount, 0),
    شيك: todayCollections
      .filter((c) => c.paymentMethod === "شيك")
      .reduce((sum, c) => sum + c.amount, 0),
    تحويل: todayCollections
      .filter((c) => c.paymentMethod === "تحويل")
      .reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">التحصيلات اليومية</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتسجيل تحصيلات المبيعات اليومية
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            تحصيل جديد
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            طباعة اليومية
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اختر التاريخ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <div className="text-sm text-muted-foreground">
              عرض تحصيلات تاريخ: {selectedDate}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="today" className="space-y-6" dir="rtl">
        <TabsList>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            تحصيلات اليوم
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            جميع التحصيلات
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            الملخص اليومي
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            التحصيلات المعلقة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>تحصيلات اليوم</CardTitle>
              <CardDescription>
                عمليات التحصيل لليوم {selectedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayCollections.length > 0 ? (
                <DataTable
                  columns={collectionColumns}
                  data={todayCollections}
                  searchPlaceholder="ابحث في تحصيلات اليوم..."
                  rtl={true}
                  showExport={true}
                  showSelection={true}
                  showSearch={true}
                  showFilters={true}
                  onEdit={(collection) => console.log("تعديل:", collection)}
                  onDelete={(collections) => {
                    if (
                      confirm(
                        `هل تريد حذف ${collections.length} عملية تحصيل؟`
                      )
                    ) {
                      console.log("حذف:", collections);
                    }
                  }}
                  filterOptions={[
                    {
                      column: "paymentMethod",
                      options: ["نقدي", "شيك", "تحويل", "آجل"],
                    },
                    {
                      column: "status",
                      options: ["مكتمل", "معلق", "ملغى"],
                    },
                  ]}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد تحصيلات لهذا اليوم</p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4"
                  >
                    إضافة تحصيل جديد
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع التحصيلات</CardTitle>
              <CardDescription>سجل كامل لجميع عمليات التحصيل</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={collectionColumns}
                data={collectionsData}
                searchPlaceholder="ابحث في جميع التحصيلات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>ملخص التحصيلات اليومية</CardTitle>
              <CardDescription>مقارنة التحصيلات حسب التاريخ</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={summaryColumns}
                data={dailySummary}
                searchPlaceholder="ابحث في التواريخ..."
                rtl={true}
                showExport={true}
                showSearch={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>التحصيلات المعلقة</CardTitle>
              <CardDescription>تحتاج متابعة وإكمال</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={collectionColumns}
                data={collectionsData.filter((c) => c.status === "معلق")}
                searchPlaceholder="ابحث في التحصيلات المعلقة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>توزيع طرق الدفع</CardTitle>
            <CardDescription>اليوم {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(paymentMethodTotals).map(([method, amount]) => (
                <div key={method}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{method}</span>
                    <span className="text-sm font-medium">
                      {amount.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${
                        method === "نقدي"
                          ? "bg-green-500"
                          : method === "شيك"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                      style={{
                        width: `${
                          (amount / Math.max(...Object.values(paymentMethodTotals))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أعلى التحصيلات</CardTitle>
            <CardDescription>اليوم {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayCollections
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {collection.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {collection.receiptNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {collection.amount.toLocaleString()} ج.م
                      </div>
                      <Badge variant="outline">{collection.paymentMethod}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة تحصيل جديد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                تصدير تقرير اليوم
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="h-4 w-4 mr-2" />
                طباعة الإيصالات
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                تسوية الخزينة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddCollectionModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}