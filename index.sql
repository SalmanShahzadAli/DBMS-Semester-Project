CREATE TABLE medicines (
    medicineID SERIAL PRIMARY KEY,
    name VARCHAR(55) NOT NULL UNIQUE,  -- Ensures no duplicate medicine names
    price INT CHECK (price > 0),  -- Ensures price is positive
    stock_quantity INT CHECK (stock_quantity >= 0),  -- Prevents negative stock
    expiry_date DATE CHECK (expiry_date > CURRENT_DATE)  -- Prevents expired medicines from being added
);

CREATE TABLE orders (
    orderID SERIAL PRIMARY KEY,
    patientID INT NOT NULL,  -- Ensures every order is linked to a patient
    total_amount INT CHECK (total_amount >= 0),  -- Prevents negative amounts
    order_date DATE NOT NULL DEFAULT CURRENT_DATE  -- Auto-fills the order date
);

CREATE TABLE orderDetails (
    order_detail_ID SERIAL PRIMARY KEY,
    orderID INT NOT NULL,
    medicineID INT NOT NULL,
    quantity INT CHECK (quantity > 0),  -- Ensures at least 1 medicine is ordered
    FOREIGN KEY (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (medicineID) REFERENCES medicines(medicineID) ON DELETE CASCADE
);
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(55),
    specialization VARCHAR(55),
    experience INT,
    mobile_number VARCHAR(15),
    email VARCHAR(55),
    consultation_fees NUMERIC (10,2),
    availability TEXT,
    clinic VARCHAR(55),
    image_url TEXT,
    description TEXT 
);
-- Insert dummy data into the doctors table
INSERT INTO doctors (name, specialization, experience, mobile_number, email, consultation_fees, availability, clinic, image_url, description) VALUES
('Dr. Alice Smith', 'Cardiologist', 12, '123-456-7890', 'alice.smith@example.com', 150.00, 'Mon-Fri, 9am-5pm', 'Heart Clinic', '/uploads/female1.jpg', 'Expert in heart diseases.'),
('Dr. Emily Davis', 'Neurologist', 7, '444-555-6666', 'emily.davis@example.com', 140.00, 'Tue-Thu, 10am-6pm', 'Brain Clinic', '/uploads/female2.jpg', 'Treats neurological disorders.'),
('Dr. Ivy Taylor', 'Gynecologist', 6, '222-333-4444', 'ivy.taylor@example.com', 135.00, 'Tue-Sat, 9am-5pm', 'Women''s Health Center', '/uploads/female3.jpg', 'Specializes in women''s health.'),
('Dr. Kelly Green', 'Cardiologist', 16, '123-456-0000', 'kelly.green@example.com', 155.00, 'Mon-Fri, 9am-5pm', 'Heart Clinic', '/uploads/female4.jpg', 'Expert in cardiovascular health.'),
('Dr. Mia Black', 'Pediatrician', 11, '555-123-0000', 'mia.black@example.com', 135.00, 'Mon-Fri, 8am-4pm', 'Children''s Clinic', '/uploads/female5.jpg', 'Provides medical care to children.'),
('Dr. Olivia Purple', 'Neurologist', 14, '444-555-0000', 'olivia.purple@example.com', 145.00, 'Tue-Thu, 10am-6pm', 'Brain Clinic', '/uploads/female6.jpg', 'Treats disorders of the nervous system.'),
('Dr. Quinn Silver', 'ENT Specialist', 10, '333-444-0000', 'quinn.silver@example.com', 130.00, 'Wed-Sat, 10am-6pm', 'Ear, Nose, Throat Clinic', '/uploads/female7.jpg', 'Specializes in ENT disorders.'),
('Dr. Sam Bronze', 'Gynecologist', 15, '222-333-0000', 'sam.bronze@example.com', 140.00, 'Tue-Sat, 9am-5pm', 'Women''s Health Center', '/uploads/female8.jpg', 'Specializes in women''s health issues.'),
('Dr. Rose Gold', 'Ophthalmologist', 8, '666-777-0000', 'rose.gold@example.com', 165.00, 'Mon-Fri, 8am-4pm', 'Eye Care Clinic', '/uploads/female9.jpg', 'Provides vision care.'),
('Dr. Tina Copper', 'Psychiatrist', 12, '888-999-0000', 'tina.copper@example.com', 175.00, 'Mon-Thu, 10am-6pm', 'Mental Health Clinic', '/uploads/female10.jpg', 'Specializes in mental health care.');
('Dr. Bob Johnson', 'Dermatologist', 8, '987-654-3210', 'bob.johnson@example.com', 120.00, 'Tue-Sat, 10am-6pm', 'Skin Care Center', '/uploads/male1.jpg', 'Specializes in skin conditions.'),
('Dr. Carol Williams', 'Pediatrician', 15, '555-123-4567', 'carol.williams@example.com', 130.00, 'Mon-Fri, 8am-4pm', 'Children''s Clinic', '/uploads/male2.jpg', 'Cares for infants and children.'),
('Dr. David Brown', 'Oncologist', 10, '111-222-3333', 'david.brown@example.com', 180.00, 'Mon-Wed, 9am-5pm', 'Cancer Center', '/uploads/male3.jpg', 'Specializes in cancer treatment.'),
('Dr. Frank Miller', 'Surgeon', 14, '777-888-9999', 'frank.miller@example.com', 200.00, 'Mon-Fri, 9am-5pm', 'Surgical Center', '/uploads/male4.jpg', 'Performs various surgical procedures.'),
('Dr. Grace Wilson', 'ENT Specialist', 9, '333-444-5555', 'grace.wilson@example.com', 125.00, 'Wed-Sat, 10am-6pm', 'Ear, Nose, Throat Clinic', '/uploads/male5.jpg', 'Specializes in ENT issues.'),
('Dr. Henry Moore', 'Ophthalmologist', 11, '666-777-8888', 'henry.moore@example.com', 160.00, 'Mon-Fri, 8am-4pm', 'Eye Care Clinic', '/uploads/male6.jpg', 'Provides eye care and treatment.'),
('Dr. Jack White', 'Psychiatrist', 13, '888-999-0000', 'jack.white@example.com', 170.00, 'Mon-Thu, 10am-6pm', 'Mental Health Clinic', '/uploads/male7.jpg', 'Provides mental health care.'),
('Dr. Liam Blue', 'Dermatologist', 7, '987-654-0000', 'liam.blue@example.com', 125.00, 'Tue-Sat, 10am-6pm', 'Skin Care Center', '/uploads/male8.jpg', 'Treats various skin diseases.'),
('Dr. Noah Gray', 'Oncologist', 9, '111-222-0000', 'noah.gray@example.com', 185.00, 'Mon-Wed, 9am-5pm', 'Cancer Center', '/uploads/male9.jpg', 'Specializes in oncology treatments.'),
('Dr. Peter Red', 'Surgeon', 6, '777-888-0000', 'peter.red@example.com', 205.00, 'Mon-Fri, 9am-5pm', 'Surgical Center', '/uploads/male10.jpg', 'Performs surgeries.')




