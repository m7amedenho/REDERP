// src/lib/constants.ts

// نفس القيم الموجودة في C# RedApi.Shared.Constants.Roles
export const ROLES = {
  ADMIN: "Admin",
  CEO: "CEO",
  AREA_MANAGER: "AreaManager",
  SALES_DELEGATE: "SalesDelegate",
  ACCOUNT_MANAGER: "AccountManager",
  ACCOUNTANT: "Accountant",
  HR: "Hr",
} as const;

// مصفوفة للعرض في الـ Select (Label عربي + Value إنجليزي)
export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: "مدير النظام (Admin)" },
  { value: ROLES.CEO, label: "مدير عام (CEO)" },
  { value: ROLES.AREA_MANAGER, label: "مدير منطقة" },
  { value: ROLES.SALES_DELEGATE, label: "مندوب مبيعات" },
  { value: ROLES.ACCOUNT_MANAGER, label: "مدير حسابات" },
  { value: ROLES.ACCOUNTANT, label: "محاسب" },
  { value: ROLES.HR, label: "موارد بشرية (HR)" },
];

// src/lib/constants.ts

// ... (أكواد Roles القديمة) ...

export const PERMISSIONS = {
  USERS: {
    CREATE: "Permissions.Users.Create",
    EDIT: "Permissions.Users.Edit",
    DELETE: "Permissions.Users.Delete",
    VIEW: "Permissions.Users.View",
  },
  CLIENTS: {
    CREATE: "Permissions.Clients.Create",
    EDIT: "Permissions.Clients.Edit",
    DELETE: "Permissions.Clients.Delete",
    VIEW: "Permissions.Clients.View",
  },
  // ضيف أي صلاحيات تانية هنا
} as const;

// قائمة مهيئة للعرض في الـ Checkbox Group
export const PERMISSION_LIST = [
  {
    category: "إدارة المستخدمين",
    items: [
      { label: "إنشاء مستخدم", value: PERMISSIONS.USERS.CREATE },
      { label: "تعديل مستخدم", value: PERMISSIONS.USERS.EDIT },
      { label: "حذف مستخدم", value: PERMISSIONS.USERS.DELETE },
      { label: "عرض المستخدمين", value: PERMISSIONS.USERS.VIEW },
    ],
  },
  {
    category: "إدارة العملاء",
    items: [
      { label: "إنشاء عميل جديد", value: PERMISSIONS.CLIENTS.CREATE },
      { label: "تعديل بيانات عميل", value: PERMISSIONS.CLIENTS.EDIT },
      { label: "حذف عميل", value: PERMISSIONS.CLIENTS.DELETE },
      { label: "عرض العملاء", value: PERMISSIONS.CLIENTS.VIEW },
    ],
  },
];
export const HIERARCHY_MAPPING: Record<string, string[]> = {
  [ROLES.SALES_DELEGATE]: [ROLES.AREA_MANAGER, ROLES.CEO], // المندوب مديره -> مدير منطقة أو CEO
  [ROLES.AREA_MANAGER]: [ROLES.CEO], // مدير المنطقة مديره -> CEO
  [ROLES.ACCOUNTANT]: [ROLES.ACCOUNT_MANAGER, ROLES.CEO], // المحاسب مديره -> مدير حسابات
  [ROLES.ACCOUNT_MANAGER]: [ROLES.CEO],
  [ROLES.HR]: [ROLES.CEO],
  // وهكذا...
};
export const ROLE_PERMISSIONS_PRESETS: Record<string, string[]> = {
  [ROLES.ADMIN]: [], // الأدمن بياخد كل حاجة تلقائي من الباك إند
  [ROLES.CEO]: [],   // الـ CEO كذلك
  
  [ROLES.AREA_MANAGER]: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.CLIENTS.VIEW,
    PERMISSIONS.CLIENTS.EDIT,
  ],
  
  [ROLES.SALES_DELEGATE]: [
    PERMISSIONS.CLIENTS.CREATE, // المندوب يقدر يعمل عميل
    PERMISSIONS.CLIENTS.VIEW,   // ويشوف العملاء
  ],
  
  [ROLES.ACCOUNT_MANAGER]: [
    PERMISSIONS.CLIENTS.VIEW,
    // صلاحيات الحسابات...
  ],
  
  [ROLES.ACCOUNTANT]: [
    // صلاحيات المحاسب...
  ],

  [ROLES.HR]: [
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.EDIT,
    PERMISSIONS.USERS.VIEW,
  ]
};