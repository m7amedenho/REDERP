import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import Image from "next/image";
export default function page() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">الملف الشخصي </h1>
        <Button variant="outline" className="gap-2">
          <IconEdit />
          تعديل الملف الشخصي
        </Button>
      </div>
      <Card className="p-6 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            معلومات المستخدم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm">اسم المستخدم: كريم الهلالي</p>
            <p className="text-sm">البريد الالكترونى : kareem@alex.com</p>
            <p className="text-sm">رقم الهاتف: +966 123 456 789</p>
            <p className="text-sm">تاريخ الانضمام: 1 يناير 2023</p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={"https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"}
              alt="User Avatar"
              width={100}
              height={100}
              
              className="rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
