import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DoctorCard from "./DoctorCard";
import { Loader2 } from "lucide-react";

interface DoctorListProps {
  specializationId: string | null;
  hospitalId: string | null;
  onBookAppointment: (doctor: any) => void;
}

const DoctorList = ({ specializationId, hospitalId, onBookAppointment }: DoctorListProps) => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', specializationId, hospitalId],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select(`
          *,
          specializations(name),
          hospitals(name, city)
        `);

      if (specializationId) {
        query = query.eq('specialization_id', specializationId);
      }
      
      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">No doctors found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
};

export default DoctorList;
