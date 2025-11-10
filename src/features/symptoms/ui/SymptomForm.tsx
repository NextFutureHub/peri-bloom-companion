import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/shared/ui/atoms/label";
import { Input } from "@/shared/ui/atoms/input";
import { Textarea } from "@/shared/ui/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Slider } from "@/shared/ui/atoms/slider";
import { GradientButton, SoftButton } from "@/shared/ui/atoms/button-variants";
import type { SymptomCategory } from "@/shared/types/api/symptom.dto";

const symptomSchema = z.object({
  category: z.enum(["physical", "emotional", "cognitive"]),
  name: z.string().min(1, "Название обязательно").max(200, "Слишком длинное название"),
  intensity: z.number().min(1).max(5),
  startDate: z.string().min(1, "Дата начала обязательна"),
  endDate: z.string().optional(),
  note: z.string().max(1000, "Заметка слишком длинная").optional(),
});

type SymptomFormData = z.infer<typeof symptomSchema>;

interface SymptomFormProps {
  onSubmit: (data: SymptomFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SymptomForm = ({ onSubmit, onCancel, isLoading = false }: SymptomFormProps) => {
  const [intensity, setIntensity] = useState([3]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SymptomFormData>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      category: "physical",
      name: "",
      intensity: 3,
      startDate: new Date().toISOString().split("T")[0],
      endDate: undefined,
      note: "",
    },
  });

  const category = watch("category");

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value);
    setValue("intensity", value[0], { shouldValidate: true });
  };

  const onSubmitForm = async (data: SymptomFormData) => {
    const submitData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Категория *</Label>
        <Select
          value={category}
          onValueChange={(value) => setValue("category", value as SymptomCategory, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="physical">Физический</SelectItem>
            <SelectItem value="emotional">Эмоциональный</SelectItem>
            <SelectItem value="cognitive">Когнитивный</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Название симптома *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Например: тошнота, головная боль, тревожность"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="intensity">
          Интенсивность: {intensity[0]}/5 *
        </Label>
        <Slider
          value={intensity}
          onValueChange={handleIntensityChange}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 - Слабая</span>
          <span>5 - Сильная</span>
        </div>
        {errors.intensity && (
          <p className="text-sm text-destructive">{errors.intensity.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Дата начала *</Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
        />
        {errors.startDate && (
          <p className="text-sm text-destructive">{errors.startDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Дата окончания (если симптом завершился)</Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate")}
        />
        {errors.endDate && (
          <p className="text-sm text-destructive">{errors.endDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Дополнительная заметка</Label>
        <Textarea
          id="note"
          {...register("note")}
          placeholder="Опишите детали, когда возникает, что помогает..."
          rows={4}
        />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <SoftButton type="button" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Отмена
        </SoftButton>
        <GradientButton type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить"}
        </GradientButton>
      </div>
    </form>
  );
};

