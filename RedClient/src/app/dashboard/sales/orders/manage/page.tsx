// src/app/dashboard/sales/orders/manage/page.tsx
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
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Printer,
  Download,
  AlertTriangle,
  RefreshCw,
  FileText,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerType: "شركة" | "فرد" | "مشتل";
  orderDate: string;
  deliveryDate: string;
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "قيد المعالجة" | "جاهز للتسليم" | "قيد التوصيل" | "مكتمل" | "ملغى";
  paymentStatus: "مدفوع" | "جزئي" | "غير مدفوع";
  priority: "عادي" | "عاجل";
  region: string;
  salesRep: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

// بيانات ثابتة
const ordersData: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "شركة النور للتجارة",
    customerType: "شركة",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    items: [
      {
        id: "1",
        productName: "بذور طماطم هجين",
        quantity: 100,
        unit: "كجم",
        unitPrice: 150,
        totalPrice: 15000,
      },
    ],
    totalAmount: 15000,
    paidAmount: 7500,
    remainingAmount: 7500,
    status: "جاهز للتسليم",
    paymentStatus: "جزئي",
    priority: "عادي",
    region: "القاهرة",
    salesRep: "أحمد محمود",
    notes: "التسليم قبل 10 صباحاً",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "مشتل الورود",
    customerType: "مشتل",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-18",
    items: [
      {
        id: "1",
        productName: "شتلات زينة",
        quantity: 500,
        unit: "شتلة",
        unitPrice: 10,
        totalPrice: 5000,
      },
    ],
    totalAmount: 5000,
    paidAmount: 0,
    remainingAmount: 5000,
    status: "قيد المعالجة",
    paymentStatus: "غير مدفوع",
    priority: "عاجل",
    region: "الدلتا",
    salesRep: "خالد سعيد",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "أحمد محمد",
    customerType: "فرد",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    items: [
      {
        id: "1",
        productName: "أسمدة NPK",
        quantity: 50,
        unit: "كيس",
        unitPrice: 300,
        totalPrice: 15000,
      },
    ],
    totalAmount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    status: "مكتمل",
    paymentStatus: "مدفوع",
    priority: "عادي",
    region: "الجيزة",
    salesRep: "محمد علي",
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

// تعريف أعمدة جدول الطلبات
const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "رقم الطلب",
  },
  {
    accessorKey: "customerName",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "orderDate",
    header: "تاريخ الطلب",
  },
  {
    accessorKey: "deliveryDate",
    header: "تاريخ التسليم",
  },
  {
    accessorKey: "totalAmount",
    header: "إجمالي المبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return <div>{amount.toLocaleString()} ج.م</div>;
    },
  },
  {
    accessorKey: "status",
    header: "حالة الطلب",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مكتمل"
          ? "default"
          : status === "جاهز للتسليم"
          ? "secondary"
          : status === "قيد المعالجة"
          ? "outline"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "حالة الدفع",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      const variant =
        status === "مدفوع"
          ? "default"
          : status === "جزئي"
          ? "secondary"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "الأولوية",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge
          variant={priority === "عاجل" ? "destructive" : "outline"}
        >
          {priority}
        </Badge>
      );
    },
  },
];

// مودال تفاصيل الطلب
function OrderDetailsModal({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            تفاصيل الطلب: {order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات العميل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">الاسم:</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">النوع:</span>
                  <Badge variant="secondary">{order.customerType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">المنطقة:</span>
                  <span>{order.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">المندوب:</span>
                  <span>{order.salesRep}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ الطلب:</span>
                  <span>{order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ التسليم:</span>
                  <span>{order.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">حالة الطلب:</span>
                  <Badge
                    variant={
                      order.status === "مكتمل"
                        ? "default"
                        : order.status === "جاهز للتسليم"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">الأولوية:</span>
                  <Badge
                    variant={order.priority === "عاجل" ? "destructive" : "outline"}
                  >
                    {order.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>بنود الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-5 p-4 border-b font-medium">
                  <div>المنتج</div>
                  <div>الكمية</div>
                  <div>سعر الوحدة</div>
                  <div>الإجمالي</div>
                  <div>الحالة</div>
                </div>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 p-4 border-b"
                  >
                    <div>{item.productName}</div>
                    <div>
                      {item.quantity} {item.unit}
                    </div>
                    <div>{item.unitPrice.toLocaleString()} ج.م</div>
                    <div>{item.totalPrice.toLocaleString()} ج.م</div>
                    <div>
                      <Badge variant="outline">متوفر</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المعلومات المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {order.totalAmount.toLocaleString()} ج.م
                  </div>
                  <div className="text-sm text-muted-foreground">
                    إجمالي الطلب
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {order.paidAmount.toLocaleString()} ج.م
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المدفوع
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${
                      order.remainingAmount > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.remainingAmount.toLocaleString()} ج.م
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المتبقي
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              طباعة الفاتورة
            </Button>
            <Button className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              تحديث الحالة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: ordersData.length,
      description: "هذا الشهر",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "قيد المعالجة",
      value: ordersData.filter((o) => o.status === "قيد المعالجة").length,
      description: "يحتاجون متابعة",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "جاهزة للتسليم",
      value: ordersData.filter((o) => o.status === "جاهز للتسليم").length,
      description: "تنتظر التوصيل",
      icon: <Truck className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المبيعات",
      value: "245,000 ج.م",
      description: "قيمة الطلبات المكتملة",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = (order: Order, newStatus: Order["status"]) => {
    console.log("تحديث حالة الطلب:", order.orderNumber, newStatus);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground mt-2">
            تتبع ومعالجة جميع طلبات العملاء
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            طلب جديد
          </Button>
        </div> */}
      </div>

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

      <Tabs defaultValue="all" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
          <TabsTrigger value="ready">جاهز للتسليم</TabsTrigger>
          <TabsTrigger value="delivering">قيد التوصيل</TabsTrigger>
          <TabsTrigger value="completed">مكتمل</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>جميع الطلبات</CardTitle>
              <CardDescription>إدارة وتعديل طلبات العملاء</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={orderColumns}
                data={ordersData}
                searchPlaceholder="ابحث في الطلبات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onView={handleView}
                filterOptions={[
                  { column: "status", options: ["قيد المعالجة", "جاهز للتسليم", "قيد التوصيل", "مكتمل", "ملغى"] },
                  { column: "paymentStatus", options: ["مدفوع", "جزئي", "غير مدفوع"] },
                  { column: "priority", options: ["عادي", "عاجل"] },
                ]}
                rowActions={[
                  {
                    label: "تحديث الحالة",
                    icon: RefreshCw,
                    onClick: (order) => handleUpdateStatus(order, "جاهز للتسليم"),
                    variant: "outline" as const,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات قيد المعالجة</CardTitle>
              <CardDescription>تحتاج متابعة وتجهيز</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={orderColumns}
                data={ordersData.filter((o) => o.status === "قيد المعالجة")}
                searchPlaceholder="ابحث في الطلبات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الجاهزة للتسليم</CardTitle>
              <CardDescription>تنتظر التوصيل للعملاء</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={orderColumns}
                data={ordersData.filter((o) => o.status === "جاهز للتسليم")}
                searchPlaceholder="ابحث في الطلبات..."
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>طلبات اليوم</CardTitle>
            <CardDescription>الطلبات الجديدة اليوم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ordersData.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{order.status}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(order)}
                    >
                      عرض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">معدل الإنجاز</span>
                  <span className="text-sm font-bold">85%</span>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full w-4/5" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">متوسط وقت التجهيز</span>
                  <span className="text-sm font-bold">2.5 يوم</span>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-blue-500 rounded-full w-3/5" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">رضا العملاء</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="h-2 bg-muted rounded-full mt-1">
                  <div className="h-full bg-yellow-500 rounded-full w-9/10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}