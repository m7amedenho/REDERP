"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save, Eye } from "lucide-react";

export default function TransactionCustomizePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تخصيص سندات الحركة</h1>
            <p className="text-muted-foreground">تخصيص محتوى وتصميم السندات</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            معاينة
          </Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            حفظ القالب
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الشركة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>اسم الشركة</Label>
                <Input defaultValue="شركة Alex للأدوات الزراعية" />
              </div>

              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input defaultValue="الرياض - المملكة العربية السعودية" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>الهاتف</Label>
                  <Input defaultValue="+966 XX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" defaultValue="info@alexasfor.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الحقول المعروضة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="field1" defaultChecked />
                <Label htmlFor="field1">رقم السند</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field2" defaultChecked />
                <Label htmlFor="field2">التاريخ والوقت</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field3" defaultChecked />
                <Label htmlFor="field3">اسم المخزن</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field4" defaultChecked />
                <Label htmlFor="field4">اسم المستخدم</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field5" />
                <Label htmlFor="field5">الباركود</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field6" />
                <Label htmlFor="field6">ملاحظات</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>معاينة السند</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 min-h-[500px]">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">
                  شركة Alex للأدوات الزراعية
                </h2>
                <p className="text-sm text-muted-foreground">
                  الرياض - المملكة العربية السعودية
                </p>
                <p className="text-sm text-muted-foreground">
                  +966 XX XXX XXXX | info@alexasfor.com
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-bold mb-4">سند استلام</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم السند:</span>
                    <span>TRX001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التاريخ:</span>
                    <span>2024-01-15 10:30 ص</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المخزن:</span>
                    <span>مخزن البذور الرئيسي</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المستخدم:</span>
                    <span>أحمد محمد</span>
                  </div>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2">الصنف</th>
                      <th className="text-right py-2">الكمية</th>
                      <th className="text-right py-2">الوحدة</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">بذور الخيار الهجين</td>
                      <td className="py-2">50</td>
                      <td className="py-2">كيلو</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-2">توقيع المستلم</p>
                    <div className="border-b border-gray-300 h-8"></div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2">توقيع المسؤول</p>
                    <div className="border-b border-gray-300 h-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
