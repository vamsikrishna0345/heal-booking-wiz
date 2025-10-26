import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, GraduationCap, DollarSign, Clock } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  education: string;
  experience_years: number;
  consultation_fee: number;
  bio: string;
  available_days: string[];
  available_time_start: string;
  available_time_end: string;
  specializations: { name: string };
  hospitals: { name: string; city: string };
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

const DoctorCard = ({ doctor, onBookAppointment }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all duration-300 border-border">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {doctor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {doctor.specializations.name}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span>{doctor.hospitals.name}, {doctor.hospitals.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{doctor.education}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <span>{doctor.experience_years} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-foreground">${doctor.consultation_fee}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Available Days:</p>
          <div className="flex flex-wrap gap-1">
            {doctor.available_days.map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day.slice(0, 3)}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {doctor.available_time_start} - {doctor.available_time_end}
          </p>
        </div>

        <Button 
          className="w-full gap-2" 
          onClick={() => onBookAppointment(doctor)}
        >
          <Calendar className="w-4 h-4" />
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
