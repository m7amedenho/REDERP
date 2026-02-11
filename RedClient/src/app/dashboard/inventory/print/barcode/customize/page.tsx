"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Save, RotateCcw, Eye } from "lucide-react";

export default function BarcodeCustomizePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">تخصيص الباركود</h1>
            <p className="text-muted-foreground">
              خيارات متقدمة لتخصيص تصميم الباركود
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            حفظ القالب
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التخصيص</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="design">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="design">التصميم</TabsTrigger>
                  <TabsTrigger value="size">الحجم</TabsTrigger>
                  <TabsTrigger value="data">البيانات</TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="space-y-4">
                  <div className="space-y-2">
                    <Label>لون الباركود</Label>
                    <Input type="color" defaultValue="#000000" />
                  </div>

                  <div className="space-y-2">
                    <Label>لون الخلفية</Label>
                    <Input type="color" defaultValue="#ffffff" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>إظهار النص</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>إضافة إطار</Label>
                    <Switch />
                  </div>
                </TabsContent>

                <TabsContent value="size" className="space-y-4">
                  <div className="space-y-2">
                    <Label>العرض (مم)</Label>
                    <Slider defaultValue={[50]} max={200} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>الارتفاع (مم)</Label>
                    <Slider defaultValue={[50]} max={200} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>حجم الخط</Label>
                    <Slider defaultValue={[12]} max={24} step={1} />
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>اسم المنتج</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>السعر</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>الوحدة</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>تاريخ الإنتاج</Label>
                    <Switch />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>معاينة حية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">معاينة التصميم</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
