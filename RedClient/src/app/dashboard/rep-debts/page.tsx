/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/rep-debts/page.tsx
"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { DataTable } from "@/components/blocks/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RepDebt,
  ClientDebt,
  PaymentRecord,
} from "../rep-debts/types/rep-debts-reports";
import {
  IconTrendingDown,
  IconAlertTriangle,
  IconCash,
  IconUser,
  IconPhone,
  IconCalendar,
  IconDownload,
  IconEye,
} from "@tabler/icons-react";
import Image from "next/image";

// بيانات تجريبية
const mockRepDebts: RepDebt[] = [
  {
    id: "1",
    repId: "1",
    repName: "رشاد سعيد",
    repImage: "/reps-rashad.png",
    department: "وجه بحري",
    totalDebt: 150000,
    currentMonthDebt: 45000,
    overdueDebt: 35000,
    lastCollectionDate: "2024-01-15",
    debtAge: 15,
    status: "مرتفع",
    clients: [
      {
        id: "1",
        clientName: "مزرعة النصر",
        clientPhone: "+20123456789",
        totalDebt: 50000,
        currentDebt: 20000,
        overdueAmount: 15000,
        lastPaymentDate: "2024-01-10",
        debtAge: 20,
        paymentHistory: [
          {
            id: "1",
            date: "2024-01-10",
            amount: 10000,
            type: "تحصيل",
            notes: "دفعة جزئية",
          },
        ],
      },
      {
        id: "2",
        clientName: "شركة الأهرام الزراعية",
        clientPhone: "+20123456788",
        totalDebt: 40000,
        currentDebt: 15000,
        overdueAmount: 10000,
        lastPaymentDate: "2024-01-12",
        debtAge: 18,
        paymentHistory: [
          {
            id: "1",
            date: "2024-01-12",
            amount: 8000,
            type: "تحصيل",
            notes: "تسوية شهرية",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    repId: "2",
    repName: "هاني سعد",
    repImage: "/reps-hany.png",
    department: "وجه قبلي",
    totalDebt: 80000,
    currentMonthDebt: 25000,
    overdueDebt: 12000,
    lastCollectionDate: "2024-01-18",
    debtAge: 8,
    status: "متوسط",
    clients: [
      {
        id: "3",
        clientName: "جمعية الفلاحين",
        clientPhone: "+20123456787",
        totalDebt: 30000,
        currentDebt: 12000,
        overdueAmount: 5000,
        lastPaymentDate: "2024-01-18",
        debtAge: 8,
        paymentHistory: [
          {
            id: "1",
            date: "2024-01-18",
            amount: 6000,
            type: "تحصيل",
            notes: "دفعة شهرية",
          },
        ],
      },
    ],
  },
];

export default function RepDebtsPage() {
  const [selectedRep, setSelectedRep] = useState<RepDebt | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientDebt | null>(null);
  const [repDialogOpen, setRepDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const handleViewRep = (rep: RepDebt) => {
    setSelectedRep(rep);
    setRepDialogOpen(true);
  };

  const handleViewClient = (client: ClientDebt) => {
    setSelectedClient(client);
    setClientDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "منخفض":
        return "default";
      case "متوسط":
        return "secondary";
      case "مرتفع":
        return "destructive";
      case "حرج":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "منخفض":
        return "text-green-600 bg-green-50";
      case "متوسط":
        return "text-yellow-600 bg-yellow-50";
      case "مرتفع":
        return "text-orange-600 bg-orange-50";
      case "حرج":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const columns: ColumnDef<RepDebt>[] = [
    {
      accessorKey: "repName",
      header: "المندوب",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image
            width={100}
            height={100}
            src={row.original.repImage}
            alt={row.original.repName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{row.original.repName}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.department}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalDebt",
      header: "إجمالي المديونية",
      cell: ({ row }) => (
        <div className="font-bold text-lg text-red-600">
          {Number(row.getValue("totalDebt")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "currentMonthDebt",
      header: "مديونية الشهر",
      cell: ({ row }) => (
        <div className="text-orange-600">
          {Number(row.getValue("currentMonthDebt")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "overdueDebt",
      header: "متأخرات",
      cell: ({ row }) => (
        <div className="text-red-600 font-semibold">
          {Number(row.getValue("overdueDebt")).toLocaleString()} ج.م
        </div>
      ),
    },
    {
      accessorKey: "debtAge",
      header: "عمر المديونية",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("debtAge")} يوم</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => (
        <Badge
          variant={getStatusVariant(row.getValue("status"))}
          className={getStatusColor(row.getValue("status"))}
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "lastCollectionDate",
      header: "آخر تحصيل",
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewRep(row.original)}
          >
            <IconEye className="h-4 w-4" />
            التفاصيل
          </Button>
        </div>
      ),
    },
  ];

  // إحصائيات سريعة
  const stats = {
    totalDebt: mockRepDebts.reduce((sum, rep) => sum + rep.totalDebt, 0),
    overdueDebt: mockRepDebts.reduce((sum, rep) => sum + rep.overdueDebt, 0),
    highRiskDebt: mockRepDebts.filter(
      (rep) => rep.status === "حرج" || rep.status === "مرتفع"
    ).length,
    totalReps: mockRepDebts.length,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* العنوان والفلترات */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مديونيات المندوبين</h1>
          <p className="text-muted-foreground mt-2">
            متابعة وإدارة مديونيات فريق المبيعات
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              <SelectItem value="وجه بحري">وجه بحري</SelectItem>
              <SelectItem value="وجه قبلي">وجه قبلي</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <IconDownload className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المديونيات
            </CardTitle>
            <IconTrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(stats.totalDebt / 1000).toFixed(0)}K ج.م
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المتأخرات</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(stats.overdueDebt / 1000).toFixed(0)}K ج.م
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مديونيات عالية الخطورة
            </CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskDebt}</div>
            <p className="text-xs text-muted-foreground">مندوب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المندوبين
            </CardTitle>
            <IconUser className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReps}</div>
          </CardContent>
        </Card>
      </div>

      {/* جدول المديونيات */}
      <DataTable
        columns={columns}
        data={mockRepDebts}
        title="تفاصيل مديونيات المندوبين"
        searchPlaceholder="ابحث باسم المندوب..."
        rtl={true}
        showExport={true}
        showSelection={true}
        showSearch={true}
        showFilters={true}
        onView={handleViewRep}
        filterOptions={[
          {
            column: "status",
            options: ["منخفض", "متوسط", "مرتفع", "حرج"],
          },
          {
            column: "department",
            options: ["وجه بحري", "وجه قبلي"],
          },
        ]}
      />

      {/* مودال تفاصيل المندوب */}
      <Dialog open={repDialogOpen} onOpenChange={setRepDialogOpen}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل مديونية المندوب</DialogTitle>
          </DialogHeader>

          {selectedRep && (
            <div className="space-y-6">
              {/* معلومات المندوب */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Image
                  width={100}
                  height={100}
                  src={selectedRep.repImage}
                  alt={selectedRep.repName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedRep.repName}</h3>
                  <p className="text-muted-foreground">
                    {selectedRep.department}
                  </p>
                </div>
                <Badge
                  variant={getStatusVariant(selectedRep.status)}
                  className={getStatusColor(selectedRep.status)}
                >
                  {selectedRep.status}
                </Badge>
              </div>

              {/* إحصائيات المديونية */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedRep.totalDebt.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المديونية
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedRep.currentMonthDebt.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      مديونية الشهر
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedRep.overdueDebt.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">متأخرات</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {selectedRep.debtAge}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      يوم منذ آخر تحصيل
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* جدول عملاء المندوب */}
              <div>
                <h4 className="text-lg font-semibold mb-4">عملاء المندوب</h4>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3">اسم العميل</th>
                        <th className="text-center p-3">إجمالي المديونية</th>
                        <th className="text-center p-3">المتأخرات</th>
                        <th className="text-center p-3">عمر المديونية</th>
                        <th className="text-center p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRep.clients.map((client) => (
                        <tr key={client.id} className="border-b">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">
                                {client.clientName}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <IconPhone className="h-3 w-3" />
                                {client.clientPhone}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center font-semibold text-red-600">
                            {client.totalDebt.toLocaleString()} ج.م
                          </td>
                          <td className="p-3 text-center text-orange-600">
                            {client.overdueAmount.toLocaleString()} ج.م
                          </td>
                          <td className="p-3 text-center">
                            {client.debtAge} يوم
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClient(client)}
                            >
                              <IconEye className="h-4 w-4" />
                              التفاصيل
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* مودال تفاصيل العميل */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل مديونية العميل</DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* معلومات العميل */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold mb-2">
                  {selectedClient.clientName}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconPhone className="h-4 w-4" />
                  <span>{selectedClient.clientPhone}</span>
                </div>
              </div>

              {/* إحصائيات المديونية */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xl font-bold text-red-600">
                      {selectedClient.totalDebt.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      إجمالي المديونية
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xl font-bold">
                      {selectedClient.currentDebt.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      مديونية حالية
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-xl font-bold text-orange-600">
                      {selectedClient.overdueAmount.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">متأخرات</p>
                  </CardContent>
                </Card>
              </div>

              {/* سجل الدفع */}
              <div>
                <h4 className="text-lg font-semibold mb-4">سجل الدفع</h4>
                <div className="space-y-3">
                  {selectedClient.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{payment.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.date}
                        </div>
                        {payment.notes && (
                          <div className="text-sm text-muted-foreground">
                            {payment.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-green-600 font-semibold">
                        +{payment.amount.toLocaleString()} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
