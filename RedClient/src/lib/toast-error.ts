export function getErrorMessage(err: any): string {
  // Axios style
  const data = err?.response?.data;

  if (!data) return err?.message || "حدث خطأ غير متوقع";

  // لو string جاهز
  if (typeof data === "string") return data;

  // Validation errors (ASP.NET غالبًا)
  // { errors: { Field: ["msg1","msg2"] } }
  if (data?.errors && typeof data.errors === "object") {
    const messages: string[] = [];

    for (const key of Object.keys(data.errors)) {
      const v = data.errors[key];
      if (Array.isArray(v)) messages.push(...v.map((x) => String(x)));
      else if (v) messages.push(String(v));
    }

    if (messages.length) return messages.join(" • ");
  }

  // ProblemDetails: title / detail
  if (data?.title && typeof data.title === "string") {
    const detail = typeof data?.detail === "string" ? `: ${data.detail}` : "";
    return `${data.title}${detail}`;
  }

  // fallback لأي object
  try {
    return JSON.stringify(data);
  } catch {
    return "حدث خطأ أثناء تنفيذ الطلب";
  }
}
