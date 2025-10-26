import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
}

const Hero = ({ onExplore }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Your Health,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book appointments with top specialists across multiple hospitals. 
            Quality healthcare is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="gap-2 text-lg"
              onClick={onExplore}
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg"
              onClick={onExplore}
            >
              <Search className="w-5 h-5" />
              Find Doctors
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border hover:shadow-[var(--shadow-medium)] transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Multiple Hospitals</h3>
            <p className="text-muted-foreground">Access to healthcare facilities across the city</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border hover:shadow-[var(--shadow-medium)] transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Expert Doctors</h3>
            <p className="text-muted-foreground">Certified specialists with years of experience</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border hover:shadow-[var(--shadow-medium)] transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Flexible Timing</h3>
            <p className="text-muted-foreground">Book appointments that fit your schedule</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
