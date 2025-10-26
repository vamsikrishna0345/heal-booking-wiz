-- Create specializations table
CREATE TABLE public.specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization_id UUID NOT NULL REFERENCES public.specializations(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  experience_years INTEGER NOT NULL,
  education TEXT NOT NULL,
  consultation_fee DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  bio TEXT,
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  available_time_start TIME DEFAULT '09:00',
  available_time_end TIME DEFAULT '17:00',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles table for patients
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  patient_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for specializations (public read)
CREATE POLICY "Specializations are viewable by everyone"
  ON public.specializations FOR SELECT
  USING (true);

-- RLS Policies for hospitals (public read)
CREATE POLICY "Hospitals are viewable by everyone"
  ON public.hospitals FOR SELECT
  USING (true);

-- RLS Policies for doctors (public read)
CREATE POLICY "Doctors are viewable by everyone"
  ON public.doctors FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample specializations
INSERT INTO public.specializations (name, description, icon) VALUES
  ('Cardiology', 'Heart and cardiovascular system specialists', 'Heart'),
  ('Dermatology', 'Skin, hair, and nail care experts', 'Sparkles'),
  ('Neurology', 'Brain and nervous system specialists', 'Brain'),
  ('Orthopedics', 'Bone, joint, and muscle care', 'Bone'),
  ('Pediatrics', 'Healthcare for infants, children, and adolescents', 'Baby'),
  ('Psychiatry', 'Mental health and behavioral disorders', 'HeartPulse'),
  ('General Medicine', 'Primary care and general health', 'Stethoscope'),
  ('Dentistry', 'Oral health and dental care', 'Smile');

-- Insert sample hospitals
INSERT INTO public.hospitals (name, address, city, phone, email) VALUES
  ('City Medical Center', '123 Healthcare Ave', 'New York', '+1-555-0101', 'info@citymedical.com'),
  ('Wellness Hospital', '456 Health Street', 'Los Angeles', '+1-555-0102', 'contact@wellness.com'),
  ('Metropolitan Hospital', '789 Care Boulevard', 'Chicago', '+1-555-0103', 'info@metropolitan.com'),
  ('Hope Medical Institute', '321 Medicine Lane', 'Houston', '+1-555-0104', 'hello@hopemedical.com');

-- Insert sample doctors (using the IDs we just created)
INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Sarah Johnson',
  (SELECT id FROM public.specializations WHERE name = 'Cardiology'),
  (SELECT id FROM public.hospitals WHERE name = 'City Medical Center'),
  15,
  'MD from Harvard Medical School, Board Certified Cardiologist',
  150.00,
  'Specialized in preventive cardiology and heart disease management with over 15 years of experience.',
  ARRAY['Monday', 'Wednesday', 'Friday'],
  '09:00'::TIME,
  '16:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Michael Chen',
  (SELECT id FROM public.specializations WHERE name = 'Neurology'),
  (SELECT id FROM public.hospitals WHERE name = 'City Medical Center'),
  12,
  'MD, PhD from Johns Hopkins, Neurology Specialist',
  180.00,
  'Expert in treating neurological disorders including epilepsy, stroke, and Alzheimer''s disease.',
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  '10:00'::TIME,
  '17:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Emily Rodriguez',
  (SELECT id FROM public.specializations WHERE name = 'Dermatology'),
  (SELECT id FROM public.hospitals WHERE name = 'Wellness Hospital'),
  10,
  'MD from Stanford Medical School, Board Certified Dermatologist',
  120.00,
  'Specializes in medical and cosmetic dermatology with a focus on skin cancer prevention.',
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  '08:00'::TIME,
  '15:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. James Wilson',
  (SELECT id FROM public.specializations WHERE name = 'Orthopedics'),
  (SELECT id FROM public.hospitals WHERE name = 'Wellness Hospital'),
  18,
  'MD from Yale, Fellowship in Sports Medicine',
  160.00,
  'Orthopedic surgeon specializing in sports injuries and joint replacement.',
  ARRAY['Monday', 'Wednesday', 'Friday'],
  '09:00'::TIME,
  '16:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Priya Patel',
  (SELECT id FROM public.specializations WHERE name = 'Pediatrics'),
  (SELECT id FROM public.hospitals WHERE name = 'Metropolitan Hospital'),
  8,
  'MD from Columbia University, Board Certified Pediatrician',
  100.00,
  'Compassionate pediatrician dedicated to providing comprehensive care for children.',
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  '08:30'::TIME,
  '16:30'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Robert Thompson',
  (SELECT id FROM public.specializations WHERE name = 'Psychiatry'),
  (SELECT id FROM public.hospitals WHERE name = 'Metropolitan Hospital'),
  14,
  'MD, PhD in Psychiatry from Duke University',
  140.00,
  'Expert in treating anxiety, depression, and mood disorders with evidence-based approaches.',
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  '10:00'::TIME,
  '18:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. Lisa Anderson',
  (SELECT id FROM public.specializations WHERE name = 'General Medicine'),
  (SELECT id FROM public.hospitals WHERE name = 'Hope Medical Institute'),
  20,
  'MD from Mayo Medical School, Internal Medicine Specialist',
  90.00,
  'Primary care physician with extensive experience in preventive medicine and chronic disease management.',
  ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  '07:00'::TIME,
  '15:00'::TIME;

INSERT INTO public.doctors (name, specialization_id, hospital_id, experience_years, education, consultation_fee, bio, available_days, available_time_start, available_time_end)
SELECT 
  'Dr. David Kim',
  (SELECT id FROM public.specializations WHERE name = 'Dentistry'),
  (SELECT id FROM public.hospitals WHERE name = 'Hope Medical Institute'),
  11,
  'DDS from University of Pennsylvania School of Dental Medicine',
  110.00,
  'General dentist specializing in cosmetic dentistry and implant procedures.',
  ARRAY['Monday', 'Wednesday', 'Thursday', 'Friday'],
  '09:00'::TIME,
  '17:00'::TIME;