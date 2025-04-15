
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { BloodGroup } from "@/types/blood";

interface ChartProps {
  inventory: {
    bloodGroup: BloodGroup;
    count: number;
  }[];
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6'];

export const BloodInventoryCharts = ({ inventory }: ChartProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Blood Group Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{}}>
            <BarChart data={inventory}>
              <XAxis dataKey="bloodGroup" />
              <YAxis allowDecimals={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Blood Group
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].payload.bloodGroup}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Units
                        </span>
                        <span className="font-bold">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }} />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Type Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={{}}>
            <PieChart>
              <Pie
                data={inventory}
                dataKey="count"
                nameKey="bloodGroup"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {inventory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
