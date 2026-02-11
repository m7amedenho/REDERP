// components/department-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentStats as ImportedDepartmentStats } from "../types/sales-rep";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DepartmentStatsProps {
  stats: ImportedDepartmentStats[];
}

export function DepartmentStats({ stats }: DepartmentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إحصائيات الأقسام</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="department" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "totalSales") return [`${Number(value).toLocaleString()} ج.م`, "المبيعات"];
                  if (name === "averageRating") return [value, "التقييم"];
                  return [value, "عدد المندوبين"];
                }}
              />
              <Bar 
                dataKey="totalSales" 
                fill="#3b82f6" 
                name="إجمالي المبيعات"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="repsCount" 
                fill="#10b981" 
                name="عدد المندوبين"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* جدول إحصائيات الأقسام */}
        <div className="mt-6 space-y-3">
          {stats.map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{dept.department}</h4>
                <p className="text-sm text-muted-foreground">
                  {dept.repsCount} مندوب
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {(dept.totalSales / 1000).toFixed(1)}K ج.م
                </p>
                <p className="text-sm text-muted-foreground">
                  تقييم {dept.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}