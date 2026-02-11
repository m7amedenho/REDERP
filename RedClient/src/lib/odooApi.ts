const ODOO_URL = "http://0.0.0.0:8069/jsonrpc";
const ODOO_DB = "alexasfor_db";
const ODOO_USER = "odoo";
const ODOO_PASSWORD = "odoo";

// تسجيل دخول Odoo
async function odooLogin() {
  const res = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "login",
        args: [ODOO_DB, ODOO_USER, ODOO_PASSWORD],
      },
      id: 1,
    }),
  });
  const data = await res.json();
  return data.result; // userId
}

// دالة عامة لعمل أي call
async function odooCall(model: string, method: string, args: any[], uid: number) {
  const res = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args],
      },
      id: Math.floor(Math.random() * 1000),
    }),
  });
  const data = await res.json();
  return data.result;
}
