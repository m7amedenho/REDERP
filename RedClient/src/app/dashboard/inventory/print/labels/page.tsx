"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tags, Printer, Download, Plus, Eye } from "lucide-react";

export default function LabelsPrintPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tags className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">طباعة اللاصقات</h1>
            <p className="text-muted-foreground">
              تصميم وطباعة لاصقات المنتجات
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات اللاصقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>حجم اللاصقة</Label>
                  <Select defaultValue="small">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير (40×30 مم)</SelectItem>
                      <SelectItem value="medium">متوسط (60×40 مم)</SelectItem>
                      <SelectItem value="large">كبير (80×60 مم)</SelectItem>
                      <SelectItem value="custom">مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>عدد النسخ</Label>
                  <Input type="number" defaultValue="1" min="1" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>اسم المنتج</Label>
                <Input placeholder="أدخل اسم المنتج" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">كيلو</SelectItem>
                      <SelectItem value="g">جرام</SelectItem>
                      <SelectItem value="l">لتر</SelectItem>
                      <SelectItem value="piece">قطعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة إلى قائمة الطباعة
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="w-4 h-4" />
                  معاينة
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>قائمة الطباعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Tags className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>لا توجد لاصقات في قائمة الطباعة</p>
                <p className="text-sm">أضف لاصقات لبدء الطباعة</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>معاينة اللاصقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    معاينة التصميم
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Button className="w-full gap-2">
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  تحميل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
