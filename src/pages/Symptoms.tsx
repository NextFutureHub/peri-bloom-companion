import { useState, useMemo } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/atoms/card";
import { GradientButton, SoftButton } from "@/shared/ui/atoms/button-variants";
import { Plus, Calendar, Trash2, Filter, X, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/atoms/dialog";
import { Input } from "@/shared/ui/atoms/input";
import { Label } from "@/shared/ui/atoms/label";
import { Textarea } from "@/shared/ui/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Badge } from "@/shared/ui/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/atoms/tabs";
import { toast } from "sonner";
import { useSymptomsQuery, useCreateSymptom, useDeleteSymptom } from "@/entities/symptom/model/useSymptom";
import type { SymptomCategory, SymptomDto, TriageLevel } from "@/shared/types/api/symptom.dto";
import { SymptomForm } from "@/features/symptoms/ui/SymptomForm";
import { SymptomCard } from "@/features/symptoms/ui/SymptomCard";
import { SymptomChart } from "@/features/symptoms/ui/SymptomChart";

const Symptoms = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SymptomCategory | undefined>();
  const [dateFilter, setDateFilter] = useState<{ start?: string; end?: string }>({});

  const { data: symptoms = [], isLoading } = useSymptomsQuery(
    undefined,
    selectedCategory,
    dateFilter.start,
    dateFilter.end,
  );

  const createMutation = useCreateSymptom();
  const deleteMutation = useDeleteSymptom();

  const filteredSymptoms = useMemo(() => {
    return symptoms;
  }, [symptoms]);

  const handleCreate = async (data: {
    category: SymptomCategory;
    name: string;
    intensity: number;
    startDate: string;
    endDate?: string;
    note?: string;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      setIsDialogOpen(false);
      toast.success(t("symptoms.successAdd"));
    } catch (error) {
      toast.error(t("symptoms.errorAdd"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("symptoms.successDelete"));
    } catch (error) {
      toast.error(t("symptoms.errorDelete"));
    }
  };

  const getTriageIcon = (level: TriageLevel | null | undefined) => {
    if (!level) return null;
    switch (level) {
      case "low":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTriageLabel = (level: TriageLevel | null | undefined) => {
    if (!level) return t("symptoms.triageAnalyzing");
    switch (level) {
      case "low":
        return t("symptoms.triageLow");
      case "medium":
        return t("symptoms.triageMedium");
      case "high":
        return t("symptoms.triageHigh");
    }
  };

  const categoryLabels: Record<SymptomCategory, string> = {
    physical: t("symptoms.categoryPhysical"),
    emotional: t("symptoms.categoryEmotional"),
    cognitive: t("symptoms.categoryCognitive"),
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                {t("symptoms.title")}
              </CardTitle>
              <CardDescription>
                {t("symptoms.description")}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <GradientButton size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("symptoms.addSymptom")}
                </GradientButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("symptoms.addSymptom")}</DialogTitle>
                </DialogHeader>
                <SymptomForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsDialogOpen(false)}
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {/* Фильтры */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label>{t("symptoms.category")}</Label>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) =>
                    setSelectedCategory(value === "all" ? undefined : (value as SymptomCategory))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("symptoms.allCategories")}</SelectItem>
                    <SelectItem value="physical">{t("symptoms.categoryPhysical")}</SelectItem>
                    <SelectItem value="emotional">{t("symptoms.categoryEmotional")}</SelectItem>
                    <SelectItem value="cognitive">{t("symptoms.categoryCognitive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>{t("symptoms.startDate")}</Label>
                <Input
                  type="date"
                  value={dateFilter.start || ""}
                  onChange={(e) =>
                    setDateFilter((prev) => ({ ...prev, start: e.target.value || undefined }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Label>{t("symptoms.endDate")}</Label>
                <Input
                  type="date"
                  value={dateFilter.end || ""}
                  onChange={(e) =>
                    setDateFilter((prev) => ({ ...prev, end: e.target.value || undefined }))
                  }
                />
              </div>
              {(selectedCategory || dateFilter.start || dateFilter.end) && (
                <SoftButton
                  onClick={() => {
                    setSelectedCategory(undefined);
                    setDateFilter({});
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t("symptoms.reset")}
                </SoftButton>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Контент с табами */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">{t("symptoms.list")}</TabsTrigger>
            <TabsTrigger value="chart">{t("symptoms.charts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {isLoading ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center text-muted-foreground">
                  {t("symptoms.loading")}
                </CardContent>
              </Card>
            ) : filteredSymptoms.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <p>{t("symptoms.noEntries")}</p>
                  <p className="text-sm mt-2">{t("symptoms.addFirstSymptom")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSymptoms.map((symptom) => (
                  <SymptomCard
                    key={symptom.id}
                    symptom={symptom}
                    onDelete={handleDelete}
                    getTriageIcon={getTriageIcon}
                    getTriageLabel={getTriageLabel}
                    categoryLabel={categoryLabels[symptom.category]}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <SymptomChart symptoms={filteredSymptoms} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Symptoms;
