import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SpecializationFilter from "@/components/SpecializationFilter";
import DoctorList from "@/components/DoctorList";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const doctorsRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    doctorsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookAppointment = (doctor: any) => {
    if (!user) {
      toast.error("Please sign in to book an appointment");
      navigate('/auth');
      return;
    }
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <Hero onExplore={handleExplore} />

      <section ref={doctorsRef} className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Doctor
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse by specialization or hospital
            </p>
          </div>

          <div className="mb-12">
            <SpecializationFilter
              selectedSpecialization={selectedSpecialization}
              onSelectSpecialization={setSelectedSpecialization}
              selectedHospital={selectedHospital}
              onSelectHospital={setSelectedHospital}
            />
          </div>

          <DoctorList
            specializationId={selectedSpecialization}
            hospitalId={selectedHospital}
            onBookAppointment={handleBookAppointment}
          />
        </div>
      </section>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
