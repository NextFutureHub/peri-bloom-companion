import { useState, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton, SoftButton } from "@/components/ui/button-variants";
import { Plus, Calendar, Trash2, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Symptom {
  id: string;
  date: string;
  name: string;
  severity: "low" | "medium" | "high";
  notes: string;
}

const Symptoms = () => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    severity: "medium" as "low" | "medium" | "high",
    notes: "",
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast.error("Введите название симптома");
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...formData,
    };

    setSymptoms((prev) => [newSymptom, ...prev]);
    setFormData({ name: "", severity: "medium", notes: "" });
    setIsDialogOpen(false);
    toast.success("Симптом добавлен");
  };

  const handleDelete = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
    toast.success("Симптом удален");
  };

  const exportToPDF = async () => {
    if (!contentRef.current || symptoms.length === 0) {
      toast.error("Нет данных для экспорта");
      return;
    }

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`symptoms_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success(t("symptoms.pdfExported"));
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Ошибка экспорта PDF");
    }
  };

  const severityColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              {t("symptoms.title")}
            </CardTitle>
            <div className="flex gap-2">
              {symptoms.length > 0 && (
                <SoftButton onClick={exportToPDF} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  {t("symptoms.exportPDF")}
                </SoftButton>
              )}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <GradientButton size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("symptoms.addSymptom")}
                </GradientButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("symptoms.addSymptom")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("symptoms.symptomName")}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Например: головная боль"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("symptoms.severity")}</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("symptoms.severityLow")}</SelectItem>
                        <SelectItem value="medium">{t("symptoms.severityMedium")}</SelectItem>
                        <SelectItem value="high">{t("symptoms.severityHigh")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("symptoms.notes")}</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Дополнительная информация..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <SoftButton onClick={() => setIsDialogOpen(false)} className="flex-1">
                      {t("symptoms.cancel")}
                    </SoftButton>
                    <GradientButton onClick={handleAdd} className="flex-1">
                      {t("symptoms.save")}
                    </GradientButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </CardHeader>
          <CardContent ref={contentRef}>
            {symptoms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("symptoms.noSymptoms")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {symptoms.map((symptom) => (
                  <Card key={symptom.id} className="shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{symptom.name}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                severityColors[symptom.severity]
                              }`}
                            >
                              {t(`symptoms.severity${symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}`)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{symptom.date}</p>
                          {symptom.notes && (
                            <p className="text-sm">{symptom.notes}</p>
                          )}
                        </div>
                        <SoftButton
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(symptom.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </SoftButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Symptoms;
