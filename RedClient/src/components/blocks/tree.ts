import {
  IconUserShield,
  IconSettings,
  IconUsers,
  IconBuilding,
  IconListDetails,
  IconArrowsExchange,
  IconBarcode,
  IconBox,
  IconClipboardCheck,
  IconReportAnalytics,
  IconStack2,
  IconPackage,
  IconTag,
  IconCoin,
  IconAdjustments,
  IconAlertTriangle,
  IconBook,
  IconBriefcase,
  IconBucket,
  IconBuildingWarehouse,
  IconCalculator,
  IconCalendarEvent,
  IconCalendarStats,
  IconCash,
  IconChartHistogram,
  IconCheckbox,
  IconChecklist,
  IconClipboardList,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconDatabase,
  IconDevices,
  IconGift,
  IconGps,
  IconListCheck,
  IconMap,
  IconMapPin,
  IconMessageCircle,
  IconReceipt,
  IconRecycle,
  IconScale,
  IconShield,
  IconShoppingCart,
  IconTransfer,
  IconTruckDelivery,
  IconUserPlus,
} from "@tabler/icons-react";
import { CalendarSearchIcon } from "lucide-react";

const data = {
  navMainGroups: [
    {
      label: "المخزون",
      items: [
        // {
        //   title: "المنتجات",
        //   url: "/dashboard/catalog/products",
        //   icon: IconPackage,
        // },
        { title: "نظرة عامة", url: "/dashboard/inventory", icon: IconPackage },

        {
          title: "إدارة الأصناف",
          url: "/dashboard/inventory/items",
          icon: IconPackage,
        },
        {
          title: "المخازن",
          url: "/dashboard/inventory/warehouses",
          icon: IconStack2,
        },
        {
          title: "تتبع المخزون",
          url: "/dashboard/inventory/tracking",
          icon: IconBox,
        },
        {
          title: "التحركات",
          url: "/dashboard/inventory/transactions",
          icon: IconListDetails,
        },
        {
          title: "مستند جديد",
          url: "/dashboard/inventory/docs/new",
          icon: IconArrowsExchange,
        },
        {
          title: "أرصدة المخزون",
          url: "/dashboard/inventory/stock/onhand",
          icon: IconReportAnalytics,
        },
        {
          title: "طبقات المخزون",
          url: "/dashboard/inventory/stock/layers",
          icon: IconReportAnalytics,
        },
        {
          title: "تتبع المخزون",
          url: "/dashboard/inventory/tracking",
          icon: IconGps,
        },
        {
          title: "كارتة الصنف",
          url: "/dashboard/inventory/stock/item-card",
          icon: IconReportAnalytics,
        },
        {
          title: "جرد جديد",
          url: "/dashboard/inventory/counts/new",
          icon: IconClipboardCheck,
        },
        {
          title: "باركود مندوب",
          url: "/dashboard/inventory/barcodes/rep-package",
          icon: IconBarcode,
        },
        {
          title: "التقارير",
          url: "/dashboard/inventory/reports/valuation",
          icon: IconReportAnalytics,
        },
      ],
    },

    {
      label: "إدارة العملاء والعلاقات",
      items: [
        {
          title: "لوحة العملاء",
          url: "/dashboard/customers/dashboard",
          icon: IconUsers,
        },
        {
          title: "عملاء محتملين",
          url: "/dashboard/customers/leads",
          icon: IconUserPlus,
        },
        {
          title: "متابعة العملاء",
          url: "/dashboard/customers/followup",
          icon: IconMessageCircle,
        },
        {
          title: "تحويل العملاء بين المندوبين",
          url: "/dashboard/customers/transfer",
          icon: IconTransfer,
        },
        {
          title: "الضمانات",
          url: "/dashboard/customers/guarantees",
          icon: IconShield,
        },
        {
          title: "إدارة الائتمان والموافقات",
          url: "/dashboard/customers/credit",
          icon: IconCheckbox,
        },
        {
          title: "مديونيات العملاء",
          url: "/dashboard/customers/customers-debts",
          icon: IconListDetails,
        },
        {
          title: "أرصدة العملاء أول المدة",
          url: "/dashboard/customers/opening-balance",
          icon: IconCash,
        },
        {
          title: "تقارير العملاء",
          url: "/dashboard/customers/reports",
          icon: IconReportAnalytics,
        },
      ],
    },

    // ------------------------------------------------------------
    // Sales Management — إدارة المبيعات
    // ------------------------------------------------------------
    {
      label: "المبيعات ",
      items: [
        { title: "نظرة عامة", url: "/dashboard/sales", icon: IconShoppingCart },
        {
          title: "فواتير المبيعات",
          url: "/dashboard/sales/invoices",
          icon: IconReceipt,
        },
        {
          title: "نقطة البيع (POS)",
          url: "/dashboard/sales/pos",
          icon: IconDevices,
        },
      
        { title: "حجوزات المبيعات", url: "/dashboard/sales/bookings", icon: IconCalendarEvent },
        { title: "إدارة الطلبات", url: "/dashboard/sales/orders/manage", icon: IconClipboardList },
        {
          title: "مرتجعات المبيعات",
          url: "/dashboard/sales/returns",
          icon: IconRecycle,
        },
        {
          title: "تقارير المبيعات",
          url: "/dashboard/sales/reports",
          icon: IconReportAnalytics,
        },
      ],
    },

    {
      label: "مندوبين المبيعات",
      items: [
        {
          title: "إدارة المندوبين",
          url: "/dashboard/sales-reps",
          icon: IconBucket,
        },
        {
          title: "مديونيات المندوبين",
          url: "/dashboard/rep-debts",
          icon: IconAlertTriangle,
        },
        {
          title: "تقارير المندوبين",
          url: "/dashboard/rep-reports",
          icon: IconReportAnalytics,
        },
      ],
    },

    // ------------------------------------------------------------
    // Inventory Management — إدارة المخزون (مقسمة)
    // ------------------------------------------------------------
   
    {
      label: "التوريد والمشتريات",
      items: [
        {
          title: "فواتير المشتريات",
          url: "/dashboard/purchase-invoice",
          icon: IconClipboardList,
        },
       
      ],
    },

    // ------------------------------------------------------------
    // Accounting — محاسب عام + مدير حسابات (مقسم)
    // ------------------------------------------------------------
    {
      label: "الحسابات العامة",
      items: [
        {
          title: "الحسابات العامة",
          url: "/dashboard/accounts",
          icon: IconCash,
        },
        { title: "رصيد أول المدة (عام)", url: "#", icon: IconGift },
        { title: "القيود اليومية", url: "#", icon: IconClipboardList },
        { title: "الإقفال السنوي", url: "#", icon: IconCalendarStats },
        { title: "ميزان المراجعة", url: "#", icon: IconScale },
        { title: "دفتر الاستاذ", url: "#", icon: IconBook },
      ],
    },

    {
      label: "الخزينة والنقدية",
      items: [
        { title: "الخزن", url: "#", icon: IconBuildingWarehouse },
        { title: "التحصيلات اليومية", url: "#", icon: IconCreditCard },
        { title: "دفتر الشيكات", url: "#", icon: IconClipboardList },
        { title: "الإيرادات الأخرى", url: "#", icon: IconGift },
        { title: "المصروفات التشغيلية", url: "#", icon: IconReceipt },
      ],
    },

    {
      label: "المدينون والدائنين",
      items: [
        { title: "المديونيات العامة", url: "#", icon: IconAlertTriangle },
        { title: "العهد", url: "#", icon: IconBriefcase },
        { title: "تقادم المديونيات", url: "#", icon: IconClock },
        { title: "مطابقة الفواتير", url: "#", icon: IconChecklist },
      ],
    },
    {
      label: "الشركة",
      items: [
        {
          title: "إدارة الفروع",
          url: "/dashboard/admin/org",
          icon: IconBuilding,
        },
        {
          title: "مستخدمين الوحدة",
          url: "/dashboard/admin/org/assigned-users",
          icon: IconListDetails,
        },
      ],
    },
    {
      label: "النظام",
      items: [
        {
          title: "المستخدمين والصلاحيات",
          url: "/dashboard/admin/users",
          icon: IconUserShield,
        },
      ],
    },
  ],
  navSecondary: [
    { title: "المستخدمين", url: "/dashboard/admin/users", icon: IconUsers },
    { title: "الإعدادات", url: "/dashboard/settings", icon: IconSettings },
  ],
};

export default data;
