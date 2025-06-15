
-- To ensure a clean slate, we'll clear any existing medical data first.
DELETE FROM public.medications;
DELETE FROM public.products WHERE category IN ('Medical Equipment', 'First Aid', 'Personal Care', 'Vitamins & Supplements');
DELETE FROM public.medical_providers;
DELETE FROM public.medical_facilities;
DELETE FROM public.medical_specializations;

-- Phase 1.1: Populate Medical Specializations
INSERT INTO public.medical_specializations (name, description) VALUES
('Cardiology', 'Deals with disorders of the heart and circulatory system.'),
('Dermatology', 'Medicine dealing with the skin, nails, hair, and its diseases.'),
('Pediatrics', 'Branch of medicine that involves the medical care of infants, children, and adolescents.'),
('Neurology', 'Branch of medicine dealing with disorders of the nervous system.'),
('Oncology', 'Branch of medicine that deals with the prevention, diagnosis, and treatment of cancer.'),
('Orthopedics', 'Branch of surgery concerned with conditions involving the musculoskeletal system.'),
('Gastroenterology', 'Deals with the digestive system and its disorders.'),
('Endocrinology', 'Deals with the endocrine system, its diseases, and its specific secretions known as hormones.'),
('Pulmonology', 'A medical speciality that deals with diseases involving the respiratory tract.'),
('Nephrology', 'A specialty of medicine and pediatrics that concerns itself with the kidneys.'),
('Urology', 'Focuses on surgical and medical diseases of the male and female urinary-tract system and the male reproductive organs.'),
('Ophthalmology', 'Branch of medicine that deals with the diagnosis and treatment of eye disorders.'),
('Otolaryngology (ENT)', 'Surgical subspecialty within medicine that deals with conditions of the ear, nose, and throat.'),
('Psychiatry', 'The medical specialty devoted to the diagnosis, prevention, and treatment of mental disorders.'),
('General Surgery', 'A surgical specialty that focuses on abdominal contents.'),
('Dentistry', 'The diagnosis, prevention, and treatment of diseases, disorders, and conditions of the oral cavity.'),
('Physiotherapy', 'Helps to restore movement and function when someone is affected by injury, illness or disability.'),
('Radiology', 'Medical discipline that uses medical imaging to diagnose and treat diseases within the bodies of animals and humans.'),
('Emergency Medicine', 'Medical specialty concerned with the care of illnesses or injuries requiring immediate medical attention.'),
('General Practice', 'A medical doctor who treats acute and chronic illnesses and provides preventive care and health education to patients.');

-- Phase 1.2: Populate Medical Facilities
-- Note: Using capitalized facility types which were added in a previous migration.
INSERT INTO public.medical_facilities (name, facility_type, address, phone, email) VALUES
('Nairobi General Hospital', 'Hospital', '123 Hospital Road, Nairobi', '+254712345678', 'info@nairobihospital.org'),
('Mombasa Coast Clinic', 'Clinic', '456 Beach Ave, Mombasa', '+254712345679', 'contact@coastclinic.com'),
('Kisumu Lakeview Hospital', 'Hospital', '789 Lakeside Dr, Kisumu', '+254712345680', 'support@lakeviewhospital.org'),
('GoodHealth Pharmacy', 'Pharmacy', '101 Wellness St, Nairobi', '+254722000111', 'orders@goodhealth.co.ke'),
('City Center Diagnostics', 'Laboratory', '212 Downtown Plaza, Nairobi', '+254733444555', 'lab@citydiagnostics.com'),
('Eldoret Medical Center', 'Clinic', '333 Uasin Gishu Ln, Eldoret', '+254711222333', 'info@eldoretmed.com'),
('Nakuru Rift Valley Hospital', 'Hospital', '444 Flamingo Way, Nakuru', '+254744555666', 'admin@riftvalleyhospital.org'),
('Wellness Forever Pharmacy', 'Pharmacy', '555 Health Blvd, Mombasa', '+254755666777', 'mombasa@wellness.co.ke'),
('Central Lab Services', 'Laboratory', '666 Test Tube Rd, Kisumu', '+254766777888', 'kisumu.lab@central.com'),
('Thika Community Clinic', 'Clinic', '777 Pineapple Grove, Thika', '+254777888999', 'thika.clinic@community.health'),
('Uhuru National Hospital', 'Hospital', '1 Uhuru Ave, Nairobi', '+254799000111', 'info@uhurunational.go.ke'),
('MediHeal Pharmacy', 'Pharmacy', '2 Health St, Eldoret', '+254798765432', 'care@mediheal.co.ke'),
('Family Care Clinic', 'Clinic', '10 Family Lane, Nakuru', '+254710987654', 'familycare@clinic.com'),
('Nyali Childrens Hospital', 'Hospital', '20 Kids Ave, Mombasa', '+254723456789', 'kids@nyalihospital.com'),
('Westlands Dental Clinic', 'Clinic', '30 Smile Road, Nairobi', '+254734567890', 'smiles@westlandsdental.com');

-- Phase 1.3: Populate Medical Providers
INSERT INTO public.medical_providers (user_id, full_name, provider_type, specialization_id, facility_id, is_verified, is_active, rating)
SELECT NULL::uuid, 'Dr. Juma Otieno', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Cardiology'), (SELECT id FROM public.medical_facilities WHERE name = 'Nairobi General Hospital'), true, true, 4.8 UNION ALL
SELECT NULL::uuid, 'Dr. Fatuma Ali', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Dermatology'), (SELECT id FROM public.medical_facilities WHERE name = 'Mombasa Coast Clinic'), true, true, 4.9 UNION ALL
SELECT NULL::uuid, 'Dr. David Kimani', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Pediatrics'), (SELECT id FROM public.medical_facilities WHERE name = 'Kisumu Lakeview Hospital'), true, true, 4.7 UNION ALL
SELECT NULL::uuid, 'Nurse Grace Wanjiru', 'nurse'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'General Practice'), (SELECT id FROM public.medical_facilities WHERE name = 'Nairobi General Hospital'), true, true, 4.6 UNION ALL
SELECT NULL::uuid, 'Pharmacist Ben Chepkwony', 'pharmacist'::public.medical_provider_type, NULL, (SELECT id FROM public.medical_facilities WHERE name = 'GoodHealth Pharmacy'), true, true, 4.8 UNION ALL
SELECT NULL::uuid, 'Lab Tech Samira Hassan', 'lab_technician'::public.medical_provider_type, NULL, (SELECT id FROM public.medical_facilities WHERE name = 'City Center Diagnostics'), true, true, 4.5 UNION ALL
SELECT NULL::uuid, 'Dr. Maria Wambui', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Neurology'), (SELECT id FROM public.medical_facilities WHERE name = 'Uhuru National Hospital'), true, true, 4.9 UNION ALL
SELECT NULL::uuid, 'Dr. Ahmed Yusuf', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Orthopedics'), (SELECT id FROM public.medical_facilities WHERE name = 'Nakuru Rift Valley Hospital'), true, true, 4.7 UNION ALL
SELECT NULL::uuid, 'Dr. Lucy Mwangi', 'dentist'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Dentistry'), (SELECT id FROM public.medical_facilities WHERE name = 'Westlands Dental Clinic'), true, true, 5.0 UNION ALL
SELECT NULL::uuid, 'Physiotherapist Kevin Omondi', 'physiotherapist'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Physiotherapy'), (SELECT id FROM public.medical_facilities WHERE name = 'Eldoret Medical Center'), true, true, 4.8 UNION ALL
SELECT NULL::uuid, 'Dr. Beatrice Achieng', 'doctor'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Ophthalmology'), (SELECT id FROM public.medical_facilities WHERE name = 'Mombasa Coast Clinic'), true, true, 4.6 UNION ALL
SELECT NULL::uuid, 'Nurse Peter Njoroge', 'nurse'::public.medical_provider_type, (SELECT id FROM public.medical_specializations WHERE name = 'Emergency Medicine'), (SELECT id FROM public.medical_facilities WHERE name = 'Uhuru National Hospital'), true, true, 4.7;

-- Phase 1.4: Populate Products (Medical Equipment & Supplies)
INSERT INTO public.products (name, description, price, category, brand, image_url, in_stock, stock_quantity) VALUES
('Digital Thermometer', 'Fast and accurate for oral, rectal, or underarm use.', 800, 'Medical Equipment', 'HealthPro', 'https://images.unsplash.com/photo-1606169933334-023a534c97ea?q=80&w=800', true, 150),
('Blood Pressure Monitor', 'Automatic upper arm monitor with large cuff.', 4500, 'Medical Equipment', 'CardioCare', 'https://images.unsplash.com/photo-1620912189835-3253a42ad4b7?q=80&w=800', true, 75),
('Pulse Oximeter', 'Fingertip device to measure blood oxygen saturation (SpO2).', 2500, 'Medical Equipment', 'OxyCheck', 'https://images.unsplash.com/photo-1616021915234-2de2f8613988?q=80&w=800', true, 120),
('Stethoscope', 'Dual-head stethoscope for medical professionals.', 3500, 'Medical Equipment', 'ListenWell', 'https://images.unsplash.com/photo-1584515933487-779824d29329?q=80&w=800', true, 50),
('First Aid Kit', 'Comprehensive 100-piece kit for home or travel.', 3000, 'First Aid', 'ReadyAid', 'https://images.unsplash.com/photo-1581594541372-b2f2a74c7a83?q=80&w=800', true, 200),
('Adhesive Bandages (100-count)', 'Sterile, assorted sizes.', 400, 'First Aid', 'CoverUp', 'https://images.unsplash.com/photo-1599428663737-5312b5585524?q=80&w=800', true, 500),
('Antiseptic Wipes (50-pack)', 'Individually wrapped alcohol wipes for cleaning wounds.', 600, 'First Aid', 'CleanZone', 'https://images.unsplash.com/photo-1604882355155-b7727c6ee9a2?q=80&w=800', true, 400),
('Surgical Masks (50-pack)', '3-ply disposable face masks.', 750, 'Personal Care', 'SafeGuard', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800', true, 1000),
('Hand Sanitizer (500ml)', '70% alcohol-based hand sanitizer gel.', 500, 'Personal Care', 'PureHands', 'https://images.unsplash.com/photo-1584734895764-a7a728751b36?q=80&w=800', true, 800),
('Vitamin C (1000mg, 90 tablets)', 'Immune support supplement.', 1200, 'Vitamins & Supplements', 'VitaBoost', 'https://images.unsplash.com/photo-1607620847228-594a7d185795?q=80&w=800', true, 300),
('Nebulizer Machine', 'For treatment of asthma, COPD and other respiratory diseases.', 6500, 'Medical Equipment', 'BreatheEasy', 'https://images.unsplash.com/photo-1631557813478-43343048997a?q=80&w=800', true, 40),
('Glucometer Kit', 'Blood glucose monitoring system with strips and lancets.', 4000, 'Medical Equipment', 'SugarTest', 'https://images.unsplash.com/photo-1581368136327-1443d3a58a47?q=80&w=800', true, 90),
('Elastic Bandage Wrap', 'For sprains and strains support.', 350, 'First Aid', 'SupportWrap', 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Elastic+Bandage', true, 600),
('Medical Gauze Roll', 'Sterile cotton gauze for wound dressing.', 250, 'First Aid', 'WoundCare', 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Gauze', true, 1000),
('Digital Weighing Scale', 'High precision scale for body weight.', 3200, 'Medical Equipment', 'ScaleRight', 'https://images.unsplash.com/photo-1596009139218-c9210214a1a4?q=80&w=800', true, 150),
('N95 Respirator Masks (20-pack)', 'High-filtration protective masks.', 2500, 'Personal Care', 'SecureFit', 'https://images.unsplash.com/photo-1599493356242-2a7a4a844976?q=80&w=800', true, 300),
('Multivitamin Tablets (60-count)', 'Daily multivitamin for overall health.', 1500, 'Vitamins & Supplements', 'DailyWell', 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Multivitamins', true, 400),
('Hot/Cold Gel Pack', 'Reusable pack for pain relief.', 900, 'First Aid', 'TheraPack', 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Gel+Pack', true, 250),
('Crutches (Pair)', 'Adjustable underarm crutches.', 2800, 'Medical Equipment', 'WalkAide', 'https://images.unsplash.com/photo-1590779837053-62383c31627c?q=80&w=800', true, 30),
('Pill Organizer (7-day)', 'Weekly pill box for medication management.', 450, 'Personal Care', 'PillPlan', 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Pill+Box', true, 500);

-- Phase 1.5: Populate Medications
INSERT INTO public.medications (name, description, category, requires_prescription, price, stock_quantity, pharmacy_id, image_url)
SELECT 'Paracetamol 500mg (16 tablets)', 'Effective pain and fever relief.', 'Painkillers', false, 150, 1000, (SELECT id FROM public.medical_facilities WHERE name = 'GoodHealth Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Paracetamol' UNION ALL
SELECT 'Ibuprofen 200mg (16 tablets)', 'Anti-inflammatory painkiller.', 'Painkillers', false, 250, 800, (SELECT id FROM public.medical_facilities WHERE name = 'Wellness Forever Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Ibuprofen' UNION ALL
SELECT 'Amoxicillin 500mg (21 capsules)', 'Common antibiotic for bacterial infections.', 'Antibiotics', true, 800, 300, (SELECT id FROM public.medical_facilities WHERE name = 'MediHeal Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Amoxicillin' UNION ALL
SELECT 'Cetirizine 10mg (14 tablets)', 'Antihistamine for allergy relief.', 'Allergy Relief', false, 300, 600, (SELECT id FROM public.medical_facilities WHERE name = 'GoodHealth Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Cetirizine' UNION ALL
SELECT 'Loperamide 2mg (6 capsules)', 'For the relief of diarrhea.', 'Digestive Health', false, 200, 400, (SELECT id FROM public.medical_facilities WHERE name = 'Wellness Forever Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Loperamide' UNION ALL
SELECT 'Salbutamol Inhaler', 'Reliever inhaler for asthma.', 'Respiratory', true, 1200, 150, (SELECT id FROM public.medical_facilities WHERE name = 'MediHeal Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Inhaler' UNION ALL
SELECT 'Metformin 500mg (28 tablets)', 'For the management of type 2 diabetes.', 'Diabetes', true, 500, 250, (SELECT id FROM public.medical_facilities WHERE name = 'GoodHealth Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Metformin' UNION ALL
SELECT 'Omeprazole 20mg (14 capsules)', 'For heartburn and acid reflux.', 'Digestive Health', false, 450, 500, (SELECT id FROM public.medical_facilities WHERE name = 'Wellness Forever Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Omeprazole' UNION ALL
SELECT 'Amlodipine 5mg (28 tablets)', 'For high blood pressure.', 'Cardiovascular', true, 600, 200, (SELECT id FROM public.medical_facilities WHERE name = 'MediHeal Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Amlodipine' UNION ALL
SELECT 'Cough Syrup (150ml)', 'Soothing relief for dry coughs.', 'Cold & Flu', false, 350, 700, (SELECT id FROM public.medical_facilities WHERE name = 'GoodHealth Pharmacy'), 'https://placehold.co/800x600/E2E8F0/A0AEC0/png?text=Cough+Syrup';
