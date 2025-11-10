import { Card, CardContent, CardHeader } from "@/shared/ui/atoms/card";
import { Badge } from "@/shared/ui/atoms/badge";
import { SoftButton } from "@/shared/ui/atoms/button-variants";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Brain, Heart, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/atoms/dialog";
import type { SymptomDto, TriageLevel } from "@/shared/types/api/symptom.dto";

interface SymptomCardProps {
  symptom: SymptomDto;
  onDelete: (id: string) => void;
  getTriageIcon: (level: TriageLevel | null | undefined) => React.ReactNode;
  getTriageLabel: (level: TriageLevel | null | undefined) => string;
  categoryLabel: string;
}

export const SymptomCard = ({
  symptom,
  onDelete,
  getTriageIcon,
  getTriageLabel,
  categoryLabel,
}: SymptomCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "physical":
        return <Activity className="w-4 h-4" />;
      case "emotional":
        return <Heart className="w-4 h-4" />;
      case "cognitive":
        return <Brain className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 4) return "text-red-500";
    if (intensity >= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getTriageBadgeVariant = (level: TriageLevel | null | undefined) => {
    if (!level) return "secondary";
    switch (level) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(symptom.category)}
              <h3 className="font-semibold text-lg">{symptom.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{categoryLabel}</Badge>
              <Badge variant="outline" className={getIntensityColor(symptom.intensity)}>
                Интенсивность: {symptom.intensity}/5
              </Badge>
            </div>
          </div>
          <SoftButton
            size="icon"
            variant="ghost"
            onClick={() => onDelete(symptom.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </SoftButton>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Начало:</strong> {formatDate(symptom.startDate)}
          </p>
          {symptom.endDate && (
            <p>
              <strong>Окончание:</strong> {formatDate(symptom.endDate)}
            </p>
          )}
        </div>

        {symptom.note && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Заметка:</p>
            <p className="bg-muted p-2 rounded-md">{symptom.note}</p>
          </div>
        )}

        {symptom.triageLevel && (
          <div className="flex items-center gap-2">
            {getTriageIcon(symptom.triageLevel)}
            <Badge variant={getTriageBadgeVariant(symptom.triageLevel)}>
              {getTriageLabel(symptom.triageLevel)}
            </Badge>
          </div>
        )}

        {symptom.aiAnalysis && (
          <Dialog>
            <DialogTrigger asChild>
              <SoftButton variant="outline" className="w-full text-left justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Показать AI анализ
              </SoftButton>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Анализ симптома</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTriageIcon(symptom.triageLevel)}
                  <Badge variant={getTriageBadgeVariant(symptom.triageLevel)}>
                    {getTriageLabel(symptom.triageLevel)}
                  </Badge>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {symptom.aiAnalysis}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {!symptom.aiAnalysis && (
          <div className="text-xs text-muted-foreground italic">
            Анализ выполняется...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

