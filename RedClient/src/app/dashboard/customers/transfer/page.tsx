// src/app/customers/transfer/page.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/blocks/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconTransfer } from "@tabler/icons-react";
import { CustomerTransfer } from "./schema";
import { getTransferLog, transferCustomers } from "./actions";
import { useEffect, useState } from "react";

// نموذج بيانات عميل وهمي للـ Table
type Customer = {
    id: string;
    name: string;
    region: string;
    currentDelegate: string;
    isSelected: boolean;
};

// دالة وهمية للحصول على العملاء
const getCustomersForTransfer = (): Customer[] => [
    { id: "C101", name: "شركة الأمل", region: "المنطقة أ", currentDelegate: "أحمد", isSelected: false },
    { id: "C102", name: "مزرعة الهدى", region: "المنطقة ب", currentDelegate: "فاطمة", isSelected: false },
    { id: "C103", name: "مستلزمات الزراعة الحديثة", region: "المنطقة ج", currentDelegate: "أحمد", isSelected: false },
];

// دالة وهمية للحصول على المندوبين
const getDelegates = () => [
    { id: "D001", name: "أحمد" },
    { id: "D002", name: "محمود" },
    { id: "D003", name: "فاطمة" },
];

// تعريف الأعمدة لـ Table بالعملاء
const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "اسم العميل",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "region",
    header: "المنطقة",
  },
  {
    accessorKey: "currentDelegate",
    header: "المندوب الحالي",
  },
];

// تعريف الأعمدة لـ Log بالتحويلات السابقة
const logColumns: ColumnDef<CustomerTransfer>[] = [
    { accessorKey: "customerName", header: "العميل" },
    { accessorKey: "currentDelegateId", header: "من (مندوب)" },
    { accessorKey: "newDelegateId", header: "إلى (مندوب)" },
    { accessorKey: "transferDate", header: "تاريخ التحويل" },
];


// صفحة المكون
export default function TransferCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>(getCustomersForTransfer());
    const [transferLog, setTransferLog] = useState<CustomerTransfer[]>([]);
    const [currentDelegate, setCurrentDelegate] = useState<string>("");
    const [newDelegate, setNewDelegate] = useState<string>("");
    const delegates = getDelegates();

    useEffect(() => {
        const loadLogs = async () => {
            setTransferLog(await getTransferLog());
        };
        loadLogs();
    }, []);

    const handleTransfer = async () => {
        const selectedCustomerIds = customers.filter(c => c.isSelected).map(c => c.id);
        if (selectedCustomerIds.length > 0 && newDelegate) {
            await transferCustomers(selectedCustomerIds, newDelegate);
            alert(`تم تحويل ${selectedCustomerIds.length} عميل للمندوب ${newDelegate}`);
            // هنا يجب إعادة تحميل البيانات
        } else {
            alert("يرجى اختيار عملاء والمندوب الجديد");
        }
    };

    const toggleSelectCustomer = (customerId: string) => {
        setCustomers(prev => prev.map(c => 
            c.id === customerId ? { ...c, isSelected: !c.isSelected } : c
        ));
    };


  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">تحويل العملاء بين المندوبين (Transfer Customers)</h1>
      <p className="text-sm text-muted-foreground">خدمة إدارية لتحويل العملاء.</p>
      
      {/* منطقة التحويل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <IconTransfer className="h-5 w-5 ml-2" />
            تنفيذ التحويل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex space-x-4">
                {/* Select المندوب الحالي */}
                <Select value={currentDelegate} onValueChange={setCurrentDelegate}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="المندوب الحالي" />
                    </SelectTrigger>
                    <SelectContent>
                        {delegates.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Select المندوب الجديد */}
                <Select value={newDelegate} onValueChange={setNewDelegate}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="المندوب الجديد" />
                    </SelectTrigger>
                    <SelectContent>
                        {delegates.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* زر تنفيذ التحويل */}
                <Button 
                    onClick={handleTransfer}
                    disabled={customers.filter(c => c.isSelected).length === 0 || !newDelegate}
                >
                    <IconTransfer className="h-4 w-4 ml-2" />
                    تنفيذ التحويل
                </Button>
            </div>

            {/* Table بالعملاء (Simplified DataTable for selection) */}
            <h3 className="text-md font-semibold mt-4">اختيار العملاء للتحويل</h3>
            <DataTable
                columns={customerColumns}
                data={customers}
                title=""
                searchPlaceholder="ابحث بالعميل..."
                rtl={true}
                showExport={false}
                showSelection={true}
                showSearch={true}
                showFilters={false}
            />
        </CardContent>
      </Card>
      
      {/* Log بالتحويلات السابقة */}
      <Card>
        <CardHeader>
          <CardTitle>سجل التحويلات السابقة (Log)</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable
                columns={logColumns}
                data={transferLog}
                title=""
                searchPlaceholder="ابحث في السجل..."
                rtl={true}
                showExport={true}
                showSelection={false}
                showSearch={true}
                showFilters={false}
            />
        </CardContent>
      </Card>
    </div>
  );
}