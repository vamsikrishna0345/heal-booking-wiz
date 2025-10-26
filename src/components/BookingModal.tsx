import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { Clock, User, MapPin } from "lucide-react";

interface BookingModalProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ doctor, isOpen, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(doctor.available_time_start.split(':')[0]);
    const end = parseInt(doctor.available_time_end.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book an appointment");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: doctor.id,
          user_id: user.id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot: selectedTime,
          patient_notes: notes,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">{doctor.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{doctor.hospitals.name}</span>
            </div>
            <Badge variant="secondary">{doctor.specializations.name}</Badge>
            <p className="text-sm font-semibold text-foreground">
              Consultation Fee: ${doctor.consultation_fee}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => {
                const dayName = format(date, 'EEEE');
                return !doctor.available_days.includes(dayName) || date < new Date();
              }}
              className="rounded-md border"
            />
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time Slot
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any specific symptoms or concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
