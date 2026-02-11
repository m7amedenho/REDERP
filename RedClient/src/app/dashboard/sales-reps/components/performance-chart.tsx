/* eslint-disable @typescript-eslint/no-explicit-any */
// components/performance-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}K`}
          />
          <Tooltip 
            formatter={(value) => [`${value} ج.م`, "المبيعات"]}
            labelFormatter={(label) => `الشهر: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="المبيعات"
          />
          <Line 
            type="monotone" 
            dataKey="clients" 
            stroke="#10b981" 
            strokeWidth={2}
            name="العملاء الجدد"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}