import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { BookOpen, Lock } from "lucide-react";
import { Progress } from "@/shared/ui/atoms/progress";

const Education = () => {
  const modules = [
    { id: 1, title: "Питание во время беременности", progress: 75, locked: false },
    { id: 2, title: "Физические упражнения", progress: 40, locked: false },
    { id: 3, title: "Эмоциональное здоровье", progress: 0, locked: true },
    { id: 4, title: "Подготовка к родам", progress: 0, locked: true },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Образовательные модули
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {modules.map((module) => (
                <Card key={module.id} className={`shadow-soft ${module.locked ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{module.title}</h3>
                      {module.locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <Progress value={module.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {module.progress}% завершено
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Education;
