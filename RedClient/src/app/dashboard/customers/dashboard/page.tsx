// src/app/customers/dashboard/page.tsx
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
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Phone,
  Calendar,
  FileText,
  Shield,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  Clock,
  CreditCard,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Printer,
  Image,
  FileUp,
} from "lucide-react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// أنواع البيانات
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "نشط" | "غير نشط" | "محتمل" | "قيد الموافقة";
  type: "شركة" | "فرد" | "مشتل";
  totalPurchases: number;
  pendingPayments: number;
  lastContact: string;
  nextFollowUp: string;
  creditLimit: number;
  creditUsed: number;
  region: string;
  salesRep: string;
  idNumber?: string;
  guarantees?: string[];
  notes?: string;
}

interface TimelineEvent {
  id: string;
  customerId: string;
  customerName: string;
  type: "مكالمة" | "زيارة" | "بريد" | "متابعة";
  description: string;
  date: string;
  time: string;
  status: "مكتمل" | "معلق" | "ملغى";
}

interface Alert {
  id: string;
  type: "متابعة" | "دفع" | "ائتمان" | "عام";
  title: string;
  description: string;
  priority: "عالي" | "متوسط" | "منخفض";
  date: string;
  customerName?: string;
}

interface StatsCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

// بيانات ثابتة
const customersData: Customer[] = [
  {
    id: "1",
    name: "شركة النور للتجارة",
    email: "info@alnour.com",
    phone: "+20123456789",
    status: "نشط",
    type: "شركة",
    totalPurchases: 150000,
    pendingPayments: 25000,
    lastContact: "2024-01-10",
    nextFollowUp: "2024-01-20",
    creditLimit: 50000,
    creditUsed: 25000,
    region: "القاهرة",
    salesRep: "أحمد محمود",
    idNumber: "12345678901234",
    guarantees: ["ضمانة 1.jpg", "عقد.pdf"],
    notes: "عميل متميز - دفع منتظم",
  },
  {
    id: "2",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+20123456780",
    status: "نشط",
    type: "فرد",
    totalPurchases: 50000,
    pendingPayments: 10000,
    lastContact: "2024-01-12",
    nextFollowUp: "2024-01-25",
    creditLimit: 20000,
    creditUsed: 10000,
    region: "الجيزة",
    salesRep: "محمد علي",
    idNumber: "29901011234567",
  },
  {
    id: "3",
    name: "مؤسسة المستقبل",
    email: "contact@future.com",
    phone: "+20123456781",
    status: "قيد الموافقة",
    type: "شركة",
    totalPurchases: 0,
    pendingPayments: 0,
    lastContact: "2024-01-15",
    nextFollowUp: "2024-01-18",
    creditLimit: 0,
    creditUsed: 0,
    region: "الإسكندرية",
    salesRep: "فاطمة أحمد",
    idNumber: "98765432109876",
  },
  {
    id: "4",
    name: "مشتل الورود",
    email: "roses@example.com",
    phone: "+20123456782",
    status: "قيد الموافقة",
    type: "مشتل",
    totalPurchases: 0,
    pendingPayments: 0,
    lastContact: "2024-01-16",
    nextFollowUp: "2024-01-19",
    creditLimit: 30000,
    creditUsed: 0,
    region: "الدلتا",
    salesRep: "خالد سعيد",
  },
  {
    id: "5",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+20123456782",
    status: "غير نشط",
    type: "فرد",
    totalPurchases: 30000,
    pendingPayments: 5000,
    lastContact: "2023-12-20",
    nextFollowUp: "2024-02-01",
    creditLimit: 15000,
    creditUsed: 5000,
    region: "القاهرة",
    salesRep: "أحمد محمود",
  },
  {
    id: "6",
    name: "شركة الأمل للزراعة",
    email: "info@alamel.com",
    phone: "+20123456783",
    status: "نشط",
    type: "شركة",
    totalPurchases: 200000,
    pendingPayments: 45000,
    lastContact: "2024-01-14",
    nextFollowUp: "2024-01-22",
    creditLimit: 100000,
    creditUsed: 45000,
    region: "الدلتا",
    salesRep: "خالد سعيد",
    idNumber: "55555555555555",
    guarantees: ["سجل تجاري.pdf", "بطاقة ضريبية.jpg"],
  },
];

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "شركة النور للتجارة",
    type: "مكالمة",
    description: "متابعة طلب شحنة البذور - تم التأكد من الاستلام",
    date: "2024-01-15",
    time: "10:30",
    status: "مكتمل",
  },
  {
    id: "2",
    customerId: "2",
    customerName: "أحمد محمد",
    type: "زيارة",
    description: "عرض المنتجات الجديدة للموسم القادم",
    date: "2024-01-16",
    time: "14:00",
    status: "معلق",
  },
  {
    id: "3",
    customerId: "3",
    customerName: "مؤسسة المستقبل",
    type: "بريد",
    description: "إرسال كتالوج المنتجات والعروض الخاصة",
    date: "2024-01-14",
    time: "09:15",
    status: "مكتمل",
  },
  {
    id: "4",
    customerId: "6",
    customerName: "شركة الأمل للزراعة",
    type: "متابعة",
    description: "مناقشة تجديد التعاون والعقود",
    date: "2024-01-17",
    time: "11:45",
    status: "معلق",
  },
];

const alertsData: Alert[] = [
  {
    id: "1",
    type: "متابعة",
    title: "متابعة مع عميل محتمل",
    description: "مؤسسة المستقبل تحتاج متابعة فورية للتفاوض على الصفقة",
    priority: "عالي",
    date: "2024-01-18",
    customerName: "مؤسسة المستقبل",
  },
  {
    id: "2",
    type: "دفع",
    title: "مدفوعات متأخرة",
    description: "5 عملاء لديهم مدفوعات متأخرة تتجاوز 30 يوم",
    priority: "متوسط",
    date: "2024-01-17",
  },
  {
    id: "3",
    type: "ائتمان",
    title: "حد ائتمان منخفض",
    description: "3 عملاء على وشك تجاوز الحد الائتماني المسموح",
    priority: "منخفض",
    date: "2024-01-16",
  },
  {
    id: "4",
    type: "متابعة",
    title: "زيارة ميدانية",
    description: "زيارة عميل جديد في منطقة القاهرة الجديدة",
    priority: "متوسط",
    date: "2024-01-19",
    customerName: "عميل جديد",
  },
];

// المكونات الجديدة
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// مودال تفاصيل العميل
function CustomerDetailsModal({
  customer,
  open,
  onClose,
}: {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl" dir="ltr">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            تفاصيل العميل: {customer.name}
          </DialogTitle>
          <DialogDescription>
            المعلومات الكاملة للعميل وسجل المعاملات
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="financial">الحسابات المالية</TabsTrigger>
            <TabsTrigger value="guarantees">الضمانات</TabsTrigger>
            <TabsTrigger value="history">سجل التعامل</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">الاسم:</span>
                    <span>{customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الهاتف:</span>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">رقم البطاقة:</span>
                    <span>{customer.idNumber || "غير متوفر"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المعلومات الإضافية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">النوع:</span>
                    <Badge variant="secondary">{customer.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الحالة:</span>
                    <Badge
                      variant={
                        customer.status === "نشط"
                          ? "default"
                          : customer.status === "محتمل"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">المنطقة:</span>
                    <span>{customer.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">المندوب:</span>
                    <span>{customer.salesRep}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {customer.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ملاحظات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{customer.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-4 w-4" />
                    إجمالي المشتريات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {customer.totalPurchases.toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-4 w-4" />
                    المديونيات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {customer.pendingPayments.toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-4 w-4" />
                    حد الائتمان
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {customer.creditLimit.toLocaleString()} ج.م
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    مستخدم: {customer.creditUsed.toLocaleString()} ج.م
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>كشف حساب العميل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 p-4 border-b font-medium">
                    <div>التاريخ</div>
                    <div>الوصف</div>
                    <div>المبلغ</div>
                    <div>الرصيد</div>
                    <div>الحالة</div>
                  </div>
                  <div className="p-4 text-center text-muted-foreground">
                    لا توجد معاملات حالياً
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                طباعة كشف الحساب
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="guarantees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الضمانات المرفوعة</CardTitle>
                <CardDescription>
                  الوثائق والضمانات المقدمة من العميل
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customer.guarantees && customer.guarantees.length > 0 ? (
                  <div className="space-y-3">
                    {customer.guarantees.map((guarantee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{guarantee}</div>
                            <div className="text-sm text-muted-foreground">
                              تم الرفع: 2024-01-15
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            عرض
                          </Button>
                          <Button variant="outline" size="sm">
                            تحميل
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد ضمانات مرفوعة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>سجل التعامل مع العميل</CardTitle>
                <CardDescription>تاريخ المتابعات والتفاعلات</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline
                  events={timelineData.filter(
                    (event) => event.customerId === customer.id
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// مودال إضافة عميل
function AddCustomerModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "فرد" as "شركة" | "فرد" | "مشتل",
    region: "",
    idNumber: "",
    creditLimit: "",
    notes: "",
    status: "قيد الموافقة" as "نشط" | "غير نشط" | "محتمل" | "قيد الموافقة",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("إضافة عميل جديد:", formData);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة عميل جديد
          </DialogTitle>
          <DialogDescription>
            املأ البيانات الأساسية للعميل الجديد
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم العميل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="أدخل اسم العميل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">رقم البطاقة / السجل</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                placeholder="رقم البطاقة أو السجل التجاري"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">نوع العميل *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "شركة" | "فرد" | "مشتل") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full"dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="فرد">فرد</SelectItem>
                  <SelectItem value="شركة">شركة</SelectItem>
                  <SelectItem value="مشتل">مشتل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">العنوان *</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                placeholder="ادخل العنوان"
                required
              />
              <Label>تحديد الموقع الجغرافي</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+20..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">سقف الائتمان</Label>
              <Input
                id="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) =>
                  setFormData({ ...formData, creditLimit: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guarantees">الضمانات (رفع ملفات)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">
                  انقر لرفع الملفات
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                />
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
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
              placeholder="أي ملاحظات إضافية عن العميل..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">إضافة العميل</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// دراور الموافقة على العملاء
function ApprovalDrawer({
  customer,
  open,
  onClose,
  onApprove,
  onReject,
}: {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  if (!customer) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>مراجعة العميل: {customer.name}</DrawerTitle>
          <DrawerDescription>
            مراجعة بيانات العميل واتخاذ قرار الموافقة أو الرفض
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">النوع:</span>
                  <Badge variant="secondary">{customer.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">المنطقة:</span>
                  <span>{customer.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">رقم الهاتف:</span>
                  <span>{customer.phone}</span>
                </div>
                {customer.idNumber && (
                  <div className="flex justify-between">
                    <span className="font-medium">رقم البطاقة:</span>
                    <span>{customer.idNumber}</span>
                  </div>
                )}
                {customer.creditLimit > 0 && (
                  <div className="flex justify-between">
                    <span className="font-medium">سقف الائتمان المطلوب:</span>
                    <span>{customer.creditLimit.toLocaleString()} ج.م</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={onApprove}
              className="flex-1 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              موافقة
            </Button>
            <Button
              onClick={onReject}
              variant="destructive"
              className="flex-1 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              رفض
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// تعريف أعمدة جدول العملاء
const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "phone",
    header: "الهاتف",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "نشط"
          ? "default"
          : status === "محتمل"
          ? "secondary"
          : status === "قيد الموافقة"
          ? "outline"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "type",
    header: "النوع",
  },
  {
    accessorKey: "totalPurchases",
    header: "إجمالي المشتريات",
    cell: ({ row }) => {
      const amount = row.getValue("totalPurchases") as number;
      return <div>{amount.toLocaleString()} ج.م</div>;
    },
  },
  {
    accessorKey: "pendingPayments",
    header: "المديونيات",
    cell: ({ row }) => {
      const amount = row.getValue("pendingPayments") as number;
      return (
        <div className={amount > 0 ? "text-destructive font-medium" : ""}>
          {amount.toLocaleString()} ج.م
        </div>
      );
    },
  },
  {
    accessorKey: "nextFollowUp",
    header: "متابعة قادمة",
  },
  {
    accessorKey: "region",
    header: "المنطقة",
  },
  {
    accessorKey: "salesRep",
    header: "المندوب",
  },
];

// تعريف أعمدة جدول العملاء قيد الموافقة
const pendingApprovalColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "type",
    header: "النوع",
  },
  {
    accessorKey: "region",
    header: "المنطقة",
  },
  {
    accessorKey: "phone",
    header: "الهاتف",
  },
  {
    accessorKey: "creditLimit",
    header: "سقف الائتمان",
    cell: ({ row }) => {
      const amount = row.getValue("creditLimit") as number;
      return <div>{amount.toLocaleString()} ج.م</div>;
    },
  },
  {
    accessorKey: "salesRep",
    header: "المندوب",
  },
  {
    accessorKey: "lastContact",
    header: "آخر تواصل",
  },
];

// مكون البطاقة الإحصائية
function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
}: StatsCard) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && (
            <span
              className={
                color === "green"
                  ? "text-green-600"
                  : color === "red"
                  ? "text-red-600"
                  : ""
              }
            >
              {" "}
              {trend}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// مكون Timeline
function Timeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "مكالمة":
        return <Phone className="h-4 w-4" />;
      case "زيارة":
        return <Calendar className="h-4 w-4" />;
      case "بريد":
        return <FileText className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-100 text-green-800 border-green-200";
      case "معلق":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ملغى":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "مكالمة":
        return "bg-blue-100 text-blue-800";
      case "زيارة":
        return "bg-purple-100 text-purple-800";
      case "بريد":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(
              event.type
            )}`}
          >
            {getIcon(event.type)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{event.customerName}</h4>
              <Badge variant="outline" className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{event.date}</span>
              <span>•</span>
              <span>{event.time}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {event.type}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// مكون التنبيهات
function AlertsList({ alerts }: { alerts: Alert[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالي":
        return "border-red-200 ";
      case "متوسط":
        return "border-yellow-200 ";
      case "منخفض":
        return "border-blue-200";
      default:
        return "border-gray-200";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "متابعة":
        return <Phone className="h-4 w-4" />;
      case "دفع":
        return <DollarSign className="h-4 w-4" />;
      case "ائتمان":
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-lg border ${getPriorityColor(
            alert.priority
          )}`}
        >
          <div className="flex items-start gap-2">
            {getIcon(alert.type)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{alert.title}</h4>
                <Badge
                  variant={
                    alert.priority === "عالي"
                      ? "destructive"
                      : alert.priority === "متوسط"
                      ? "default"
                      : "secondary"
                  }
                >
                  {alert.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {alert.description}
              </p>
              {alert.customerName && (
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">{alert.customerName}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {alert.date}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// مكون العملاء المحتملين
function PotentialCustomers() {
  const potentialCustomers = customersData.filter(
    (customer) => customer.status === "محتمل"
  );

  return (
    <div className="space-y-3">
      {potentialCustomers.map((customer) => (
        <div
          key={customer.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{customer.name}</h4>
              <p className="text-xs text-muted-foreground">{customer.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">محتمل</Badge>
            <Button variant="outline" size="sm">
              متابعة
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CustomersDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isApprovalDrawerOpen, setIsApprovalDrawerOpen] = useState(false);

  const stats: StatsCard[] = [
    {
      title: "إجمالي العملاء",
      value: customersData.length,
      description: "+2 من الشهر الماضي",
      trend: "+12%",
      color: "green",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المبيعات الشهرية",
      value: "245,000 ج.م",
      description: "+15% من الشهر الماضي",
      trend: "+15%",
      color: "green",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "المديونيات",
      value: "45,000 ج.م",
      description: "+5% من الشهر الماضي",
      trend: "+5%",
      color: "red",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "قيد الموافقة",
      value: customersData.filter((c) => c.status === "قيد الموافقة").length,
      description: "يحتاجون مراجعة",
      icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  const handleEdit = (customer: Customer) => {
    console.log("تعديل العميل:", customer);
    setSelectedCustomer(customer);
    // يمكن فتح مودال التعديل هنا
  };

  const handleDelete = (customers: Customer[]) => {
    console.log("حذف العملاء:", customers);
    if (confirm(`هل تريد حقاً حذف ${customers.length} عميل؟`)) {
      // تنفيذ الحذف
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const handleFollowUp = (customer: Customer) => {
  console.log("متابعة العميل:", customer);

  if (customer.phone) {
    // يفتح الاتصال على الموبايل
    window.location.href = `tel:${customer.phone}`;
  } else {
    console.log("رقم العميل غير متوفر");
  }
};

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    console.log("تم إضافة العميل بنجاح");
    setIsAddModalOpen(false);
  };

  const handleApproveCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsApprovalDrawerOpen(true);
  };

  const handleApproveConfirm = () => {
    console.log("تمت الموافقة على العميل:", selectedCustomer);
    setIsApprovalDrawerOpen(false);
  };

  const handleRejectConfirm = () => {
    console.log("تم رفض العميل:", selectedCustomer);
    setIsApprovalDrawerOpen(false);
  };

  const pendingCustomers = customersData.filter(
    (customer) => customer.status === "قيد الموافقة"
  );

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            لوحة تحكم العملاء
          </h1>
          <p className="text-muted-foreground mt-2">
            نظرة عامة على أداء العملاء والمتابعات والمديونيات
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddCustomer}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            trend={stat.trend}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            العملاء
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            قيد الموافقة ({pendingCustomers.length})
          </TabsTrigger>
          <TabsTrigger value="followups" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            المتابعات
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            التنبيهات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* المخططات والبيانات */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>المبيعات والمديونيات</CardTitle>
                <CardDescription>
                  أداء العملاء خلال الشهر الحالي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                  مخطط المبيعات والمديونيات (سيتم إضافة Recharts)
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>أحدث المتابعات</CardTitle>
                <CardDescription>آخر الأنشطة مع العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline events={timelineData} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* العملاء المحتملين */}
            <Card>
              <CardHeader>
                <CardTitle>العملاء المحتملين</CardTitle>
                <CardDescription>يحتاجون متابعة فورية</CardDescription>
              </CardHeader>
              <CardContent>
                <PotentialCustomers />
              </CardContent>
            </Card>

            {/* أعلى المديونيات */}
            <Card>
              <CardHeader>
                <CardTitle>أعلى المديونيات</CardTitle>
                <CardDescription>العملاء المتأخرين في السداد</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customersData
                    .filter((c) => c.pendingPayments > 0)
                    .sort((a, b) => b.pendingPayments - a.pendingPayments)
                    .slice(0, 3)
                    .map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-destructive font-medium">
                            {customer.pendingPayments.toLocaleString()} ج.م
                          </div>
                        </div>
                        <Badge
                          variant={
                            customer.pendingPayments > 20000
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {customer.pendingPayments > 20000
                            ? "عالية"
                            : "متوسطة"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* التنبيهات العاجلة */}
            <Card>
              <CardHeader>
                <CardTitle>التنبيهات العاجلة</CardTitle>
                <CardDescription>الأولويات العالية</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList
                  alerts={alertsData.filter((a) => a.priority === "عالي")}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle>إدارة العملاء</CardTitle>
              <CardDescription>
                قائمة كاملة بالعملاء وإجراءات الإدارة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={customerColumns}
                data={customersData.filter((c) => c.status !== "قيد الموافقة")}
                title=""
                searchPlaceholder="ابحث بالعملاء..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                rowActions={[
                  {
                    label: "متابعة",
                    icon: Phone,
                    onClick: handleFollowUp,
                    variant: "outline" as const,
                  },
                ]}
                filterOptions={[
                  {
                    column: "status",
                    options: ["نشط", "غير نشط", "محتمل"],
                  },
                  {
                    column: "type",
                    options: ["شركة", "فرد", "مشتل"],
                  },
                  {
                    column: "region",
                    options: ["القاهرة", "الجيزة", "الإسكندرية", "الدلتا"],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>العملاء قيد الموافقة</CardTitle>
              <CardDescription>
                مراجعة وموافقة على العملاء الجدد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={pendingApprovalColumns}
                data={pendingCustomers}
                title=""
                searchPlaceholder="ابحث في العملاء قيد الموافقة..."
                rtl={true}
                showExport={true}
                showSelection={true}
                showSearch={true}
                showFilters={true}
                onView={handleView}
                rowActions={[
                  {
                    label: "مراجعة",
                    icon: Eye,
                    onClick: handleApproveCustomer,
                    variant: "default" as const,
                  },
                ]}
                filterOptions={[
                  {
                    column: "type",
                    options: ["شركة", "فرد", "مشتل"],
                  },
                  {
                    column: "region",
                    options: ["القاهرة", "الجيزة", "الإسكندرية", "الدلتا"],
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups">
          <Card>
            <CardHeader>
              <CardTitle>جدول المتابعات</CardTitle>
              <CardDescription>سجل كامل للمتابعات والأنشطة</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline events={timelineData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>تنبيهات عالية</CardTitle>
                <CardDescription>الأولويات العاجلة</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList
                  alerts={alertsData.filter((a) => a.priority === "عالي")}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>تنبيهات متوسطة</CardTitle>
                <CardDescription>تحتاج متابعة خلال 48 ساعة</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList
                  alerts={alertsData.filter((a) => a.priority === "متوسط")}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>تنبيهات منخفضة</CardTitle>
                <CardDescription>متابعة عادية</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList
                  alerts={alertsData.filter((a) => a.priority === "منخفض")}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* المودالات */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      <AddCustomerModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <ApprovalDrawer
        customer={selectedCustomer}
        open={isApprovalDrawerOpen}
        onClose={() => setIsApprovalDrawerOpen(false)}
        onApprove={handleApproveConfirm}
        onReject={handleRejectConfirm}
      />
    </div>
  );
}
