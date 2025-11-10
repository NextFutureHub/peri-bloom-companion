import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/atoms/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import type { SymptomDto } from "@/shared/types/api/symptom.dto";

interface SymptomChartProps {
  symptoms: SymptomDto[];
}

export const SymptomChart = ({ symptoms }: SymptomChartProps) => {
  const chartData = useMemo(() => {
    // Группируем по датам
    const byDate = new Map<string, { date: string; intensity: number; count: number }>();

    symptoms.forEach((symptom) => {
      const date = new Date(symptom.startDate).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      });
      const existing = byDate.get(date) || { date, intensity: 0, count: 0 };
      existing.intensity += symptom.intensity;
      existing.count += 1;
      byDate.set(date, existing);
    });

    return Array.from(byDate.values())
      .map((item) => ({
        ...item,
        avgIntensity: item.count > 0 ? Number((item.intensity / item.count).toFixed(1)) : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [symptoms]);

  const categoryData = useMemo(() => {
    const byCategory = new Map<string, number>();
    symptoms.forEach((symptom) => {
      byCategory.set(symptom.category, (byCategory.get(symptom.category) || 0) + 1);
    });
    return Array.from(byCategory.entries()).map(([category, count]) => ({
      category: category === "physical" ? "Физический" : category === "emotional" ? "Эмоциональный" : "Когнитивный",
      count,
    }));
  }, [symptoms]);

  const triageData = useMemo(() => {
    const byTriage = new Map<string, number>();
    symptoms.forEach((symptom) => {
      if (symptom.triageLevel) {
        byTriage.set(
          symptom.triageLevel,
          (byTriage.get(symptom.triageLevel) || 0) + 1,
        );
      }
    });
    return Array.from(byTriage.entries()).map(([level, count]) => ({
      level: level === "low" ? "Низкий" : level === "medium" ? "Средний" : "Высокий",
      count,
    }));
  }, [symptoms]);

  if (symptoms.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-12 text-center text-muted-foreground">
          Нет данных для отображения графиков
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Интенсивность симптомов по датам</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ intensity: { label: "Средняя интенсивность" } }} className="h-[300px]">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="avgIntensity"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Средняя интенсивность"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Распределение по категориям</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Количество" } }} className="h-[250px]">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Распределение по уровню триажа</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Количество" } }} className="h-[250px]">
              <BarChart data={triageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

