import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Sparkles, Brain, Bone, Baby, 
  HeartPulse, Stethoscope, Smile, Building2 
} from "lucide-react";

interface SpecializationFilterProps {
  selectedSpecialization: string | null;
  onSelectSpecialization: (id: string | null) => void;
  selectedHospital: string | null;
  onSelectHospital: (id: string | null) => void;
}

const iconMap: Record<string, any> = {
  Heart, Sparkles, Brain, Bone, Baby, HeartPulse, Stethoscope, Smile
};

const SpecializationFilter = ({
  selectedSpecialization,
  onSelectSpecialization,
  selectedHospital,
  onSelectHospital,
}: SpecializationFilterProps) => {
  const { data: specializations } = useQuery({
    queryKey: ['specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Specializations</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedSpecialization === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => onSelectSpecialization(null)}
          >
            All Specializations
          </Badge>
          {specializations?.map((spec) => {
            const Icon = iconMap[spec.icon || 'Stethoscope'];
            return (
              <Badge
                key={spec.id}
                variant={selectedSpecialization === spec.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm gap-2"
                onClick={() => onSelectSpecialization(spec.id)}
              >
                <Icon className="w-4 h-4" />
                {spec.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Hospitals</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedHospital === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm"
            onClick={() => onSelectHospital(null)}
          >
            All Hospitals
          </Badge>
          {hospitals?.map((hospital) => (
            <Badge
              key={hospital.id}
              variant={selectedHospital === hospital.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm"
              onClick={() => onSelectHospital(hospital.id)}
            >
              {hospital.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecializationFilter;
