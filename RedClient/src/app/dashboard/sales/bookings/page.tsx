// src/app/dashboard/sales/bookings/page.tsx
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
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Phone,
  Clock,
  FileText,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Printer,
  Download,
  CalendarDays,
  MapPin,
  Tag,
  Package,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  bookingDate: string;
  deliveryDate: string;
  status: "مؤكد" | "معلق" | "ملغى" | "تم التسليم";
  priority: "عادي" | "عاجل";
  paymentStatus: "مدفوع" | "جزئي" | "غير مدفوع";
  region: string;
  salesRep: string;
  notes?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "تسليم" | "متابعة" | "دفع";
  customerName: string;
  status: "مؤكد" | "معلق";
}

// بيانات ثابتة
const bookingsData: Booking[] = [
  {
    id: "1",
    customerName: "شركة النور للتجارة",
    customerPhone: "+20123456789",
    product: "بذور طماطم هجين",
    quantity: 100,
    unit: "كجم",
    price: 150,
    total: 15000,
    bookingDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    status: "مؤكد",
    priority: "عادي",
    paymentStatus: "جزئي",
    region: "القاهرة",
    salesRep: "أحمد محمود",
    notes: "التسليم في الصباح الباكر",
  },
  {
    id: "2",
    customerName: "مشتل الورود",
    customerPhone: "+20123456782",
    product: "شتلات زينة",
    quantity: 500,
    unit: "شتلة",
    price: 10,
    total: 5000,
    bookingDate: "2024-01-16",
    deliveryDate: "2024-01-18",
    status: "معلق",
    priority: "عاجل",
    paymentStatus: "غير مدفوع",
    region: "الدلتا",
    salesRep: "خالد سعيد",
  },
  {
    id: "3",
    customerName: "أحمد محمد",
    customerPhone: "+20123456780",
    product: "أسمدة NPK",
    quantity: 50,
    unit: "كيس",
    price: 300,
    total: 15000,
    bookingDate: "2024-01-14",
    deliveryDate: "2024-01-17",
    status: "تم التسليم",
    priority: "عادي",
    paymentStatus: "مدفوع",
    region: "الجيزة",
    salesRep: "محمد علي",
  },
  {
    id: "4",
    customerName: "شركة الأمل للزراعة",
    customerPhone: "+20123456783",
    product: "مبيدات حشرية",
    quantity: 200,
    unit: "لتر",
    price: 75,
    total: 15000,
    bookingDate: "2024-01-13",
    deliveryDate: "2024-01-16",
    status: "مؤكد",
    priority: "عاجل",
    paymentStatus: "جزئي",
    region: "الدلتا",
    salesRep: "خالد سعيد",
  },
  {
    id: "5",
    customerName: "فاطمة علي",
    customerPhone: "+20123456782",
    product: "بذور فراولة",
    quantity: 30,
    unit: "كجم",
    price: 200,
    total: 6000,
    bookingDate: "2024-01-17",
    deliveryDate: "2024-01-22",
    status: "معلق",
    priority: "عادي",
    paymentStatus: "غير مدفوع",
    region: "القاهرة",
    salesRep: "أحمد محمود",
  },
];

const calendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "تسليم طلب شركة النور",
    date: "2024-01-20",
    time: "08:00",
    type: "تسليم",
    customerName: "شركة النور للتجارة",
    status: "مؤكد",
  },
  {
    id: "2",
    title: "متابعة دفعة مشتل الورود",
    date: "2024-01-18",
    time: "10:30",
    type: "دفع",
    customerName: "مشتل الورود",
    status: "معلق",
  },
  {
    id: "3",
    title: "تسليم أسمدة لأحمد محمد",
    date: "2024-01-17",
    time: "14:00",
    type: "تسليم",
    customerName: "أحمد محمد",
    status: "مؤكد",
  },
  {
    id: "4",
    title: "متابعة طلب فاطمة علي",
    date: "2024-01-19",
    time: "11:00",
    type: "متابعة",
    customerName: "فاطمة علي",
    status: "معلق",
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// تعريف أعمدة جدول الحجوزات
const bookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "رقم الحجز",
  },
  {
    accessorKey: "customerName",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "product",
    header: "المنتج",
  },
  {
    accessorKey: "quantity",
    header: "الكمية",
    cell: ({ row }) => {
      const booking = row.original;
      return `${booking.quantity} ${booking.unit}`;
    },
  },
  {
    accessorKey: "total",
    header: "القيمة",
    cell: ({ row }) => {
      const amount = row.getValue("total") as number;
      return <div>{amount.toLocaleString()} ج.م</div>;
    },
  },
  {
    accessorKey: "bookingDate",
    header: "تاريخ الحجز",
  },
  {
    accessorKey: "deliveryDate",
    header: "تاريخ التسليم",
  },
  {
    accessorKey: "status",
    header: "حالة الحجز",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "مؤكد"
          ? "default"
          : status === "معلق"
          ? "secondary"
          : status === "تم التسليم"
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
];

// مكون التقويم
function BookingCalendar({ events }: { events: CalendarEvent[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  return (
    <div className="space-y-4">
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          hasEvents: (date) => {
            const dateStr = date.toISOString().split("T")[0];
            return eventsByDate[dateStr]?.length > 0;
          },
        }}
        modifiersStyles={{
          hasEvents: {
            fontWeight: "bold",
            color: "#2563eb",
          },
        }}
      />

      {date && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              أحداث {date.toLocaleDateString("ar-EG")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsByDate[date.toISOString().split("T")[0]] ? (
              <div className="space-y-3">
                {eventsByDate[date.toISOString().split("T")[0]].map(
                  (event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div
                        className={`w-2 h-full rounded ${
                          event.type === "تسليم"
                            ? "bg-green-500"
                            : event.type === "دفع"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge
                            variant={
                              event.status === "مؤكد"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          <span>{event.customerName}</span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                لا توجد أحداث في هذا اليوم
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// مودال إضافة حجز
function AddBookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    unit: "كجم",
    price: "",
    deliveryDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إضافة حجز جديد:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة حجز جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="product">المنتج *</Label>
              <Select
                value={formData.product}
                onValueChange={(value) =>
                  setFormData({ ...formData, product: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="بذور طماطم">بذور طماطم</SelectItem>
                  <SelectItem value="شتلات زينة">شتلات زينة</SelectItem>
                  <SelectItem value="أسمدة">أسمدة</SelectItem>
                  <SelectItem value="مبيدات">مبيدات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">الوحدة</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="كجم">كيلوجرام</SelectItem>
                  <SelectItem value="شتلة">شتلة</SelectItem>
                  <SelectItem value="كيس">كيس</SelectItem>
                  <SelectItem value="لتر">لتر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">سعر الوحدة *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">تاريخ التسليم *</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية</Label>
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
            <Button type="submit">حفظ الحجز</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SalesBookingsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    {
      title: "إجمالي الحجوزات",
      value: bookingsData.length,
      description: "+3 من الأسبوع الماضي",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "قيمة الحجوزات",
      value: "85,000 ج.م",
      description: "شهرياً",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "معلق التسليم",
      value: bookingsData.filter((b) => b.status === "معلق").length,
      description: "يحتاجون متابعة",
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "معدل التحويل",
      value: "85%",
      description: "من الحجوزات إلى مبيعات",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">حجوزات المبيعات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع حجوزات العملاء
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          حجز جديد
        </Button>
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

      <Tabs defaultValue="list" className="space-y-6" dir="rtl">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            قائمة الحجوزات
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            التقويم
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>جميع الحجوزات</CardTitle>
              <CardDescription>إدارة وتعديل حجوزات العملاء</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={bookingColumns}
                data={bookingsData}
                searchPlaceholder="ابحث في الحجوزات..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                filterOptions={[
                  { column: "status", options: ["مؤكد", "معلق", "ملغى", "تم التسليم"] },
                  { column: "paymentStatus", options: ["مدفوع", "جزئي", "غير مدفوع"] },
                  { column: "region", options: ["القاهرة", "الجيزة", "الإسكندرية", "الدلتا"] },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>تقويم الحجوزات</CardTitle>
                  <CardDescription>جدول التسليم والمتابعات</CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingCalendar events={calendarEvents} />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>الحجوزات العاجلة</CardTitle>
                  <CardDescription>التسليم خلال 48 ساعة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookingsData
                      .filter((b) => b.priority === "عاجل")
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="p-3 border border-red-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {booking.customerName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {booking.product}
                              </div>
                            </div>
                            <Badge variant="destructive">عاجل</Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>{booking.deliveryDate}</span>
                            <span>•</span>
                            <DollarSign className="h-3 w-3" />
                            <span>{booking.total.toLocaleString()} ج.م</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الحجوزات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  مخططات تحليلية للحجوزات
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddBookingModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}