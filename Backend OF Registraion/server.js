const { Client } = require("pg");
const express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { error } = require("console");
const session = require('express-session');
const saltRounds = 10;
const port = 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'yourSecretKey',    // change this to a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }   // set true if using HTTPS
}));
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Pakistan98765",
    port: 5432
})
client.connect()
    .then(() => {
        console.log("Connected To PostgreSQL(postgres)")
        createTableusers(); // Call The Functin to create The users Table.
        createTablemedicine(); // Call The Function to create the medicine Table.
        insertdummymedicines(); // Call The function To Insert Hard Coded Data Into Medicines Table 
        createtableappointment(); // Call The function to create appointments Table.
        createTableAdmin(); // Call The function to create admins table.
        createTabledoctors(); // Call The Function to create doctors table.
        insertdummydoctors(); // Call The Function To insert dummy data into doctors table.
    })
    .catch((err) => console.error("Error Connecting To Database(postgres)", err.stack));
async function createTablemedicine() {
    const query = `CREATE TABLE IF NOT EXISTS medicines (
    medicineID SERIAL PRIMARY KEY,
    image VARCHAR(155),
    name VARCHAR(55) NOT NULL UNIQUE,  -- Ensures no duplicate medicine names
    price INT CHECK (price > 0),  -- Ensures price is positive
    stock_quantity INT CHECK (stock_quantity >= 0),  -- Prevents negative stock
    expiry_date DATE CHECK (expiry_date > CURRENT_DATE)  -- Prevents expired medicines from being added
    )`
    try {
        await client.query(query);
        console.log("Medicines Table created IF Not Exists");
    } catch (err) {
        console.error("Error creating Table", err);
    }
}
async function createtableappointment() {
    try {
        const query = `CREATE TABLE IF NOT EXISTS appointment (
            appointment_id SERIAL PRIMARY KEY,
            patient_name VARCHAR(100),
            patient_email VARCHAR(100),
            doctor_name VARCHAR(100) NOT NULL,
            doctor_email VARCHAR(100) NOT NULL,
            appointment_date TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        // Assuming you're using a PostgreSQL client like pg
        const result = await client.query(query);
        console.log("Appointment table created successfully");
        return result;
    } catch (error) {
        console.error("Error Creating Appointments Table:", error);
        throw error;
    }
};
async function insertdummymedicines() {
    try {
        const result = await client.query("SELECT COUNT(*) FROM medicines")
        const count = parseInt(result.rows[0].count);
        if (count == 0) {
            const insertQuery = `INSERT INTO medicines (name,image, price, stock_quantity, expiry_date) VALUES
        ('Paracetamol','/uploads/paracetamol.png', 1.99, 150, '2026-03-15'),
        ('Amoxicillin','/uploads/Amoxicillin.png',5.50, 75, '2025-12-01'),
        ('Ibuprofen','/uploads/Ibuprofen.png',3.25, 200, '2026-05-10'),
        ('Cetirizine','/uploads/Cetirizine.png',2.00, 180, '2025-11-30'),
        ('Metformin','/uploads/Metformin.png',4.75, 120, '2027-01-20'),
        ('Azithromycin','/uploads/Azithromycin.png',6.30, 60, '2025-09-05'),
        ('Omeprazole','/uploads/Omeprazole.png',3.90, 100, '2026-02-28'),
        ('Salbutamol','/uploads/Salbutamol.png', 4.20, 85, '2025-10-12'),
        ('Lisinopril','/uploads/Lisinopril.png',2.75, 110, '2027-06-30'),
        ('Simvastatin','/uploads/softin.png',3.10, 90, '2026-08-22');`
            await client.query(insertQuery);
            console.log("Successfully Inserted Data Into Medicines Table");
        } else {
            console.log("Medicines Table Already Has Data");
        }
    } catch (err) {
        console.error("Error Inserting Data Into Medicines Table", err);
    }
};
async function insertdummydoctors() {
    try {
        const result = await client.query("SELECT COUNT(*) FROM doctors");
        const count = parseInt(result.rows[0].count);
        if (count === 0) {
            const query = `INSERT INTO doctors (name, specialization, experience, mobile_number, email, consultation_fees, availability, clinic, image_url, description) 
            VALUES
            ('Dr. Alice Smith', 'Cardiologist', 12, '123-456-7890', 'alice.smith@example.com', 150.00, 'Mon-Fri, 9am-5pm', 'Heart Clinic', '/uploads/female1.jpg', 'Expert in heart diseases.'),
            ('Dr. Emily Davis', 'Neurologist', 7, '444-555-6666', 'emily.davis@example.com', 140.00, 'Tue-Thu, 10am-6pm', 'Brain Clinic', '/uploads/female2.jpg', 'Treats neurological disorders.'),
            ('Dr. Ivy Taylor', 'Gynecologist', 6, '222-333-4444', 'ivy.taylor@example.com', 135.00, 'Tue-Sat, 9am-5pm', 'Women''s Health Center', '/uploads/female3.jpg', 'Specializes in women''s health.'),
            ('Dr. Kelly Green', 'Cardiologist', 16, '123-456-0000', 'kelly.green@example.com', 155.00, 'Mon-Fri, 9am-5pm', 'Heart Clinic', '/uploads/female4.jpg', 'Expert in cardiovascular health.'),
            ('Dr. Mia Black', 'Pediatrician', 11, '555-123-0000', 'mia.black@example.com', 135.00, 'Mon-Fri, 8am-4pm', 'Children''s Clinic', '/uploads/female5.jpg', 'Provides medical care to children.'),
            ('Dr. Olivia Purple', 'Neurologist', 14, '444-555-0000', 'olivia.purple@example.com', 145.00, 'Tue-Thu, 10am-6pm', 'Brain Clinic', '/uploads/female6.jpg', 'Treats disorders of the nervous system.'),
            ('Dr. Quinn Silver', 'ENT Specialist', 10, '333-444-0000', 'quinn.silver@example.com', 130.00, 'Wed-Sat, 10am-6pm', 'Ear, Nose, Throat Clinic', '/uploads/female7.jpg', 'Specializes in ENT disorders.'),
            ('Dr. Sam Bronze', 'Gynecologist', 15, '222-333-0000', 'sam.bronze@example.com', 140.00, 'Tue-Sat, 9am-5pm', 'Women''s Health Center', '/uploads/female8.jpg', 'Specializes in women''s health issues.'),
            ('Dr. Rose Gold', 'Ophthalmologist', 8, '666-777-0000', 'rose.gold@example.com', 165.00, 'Mon-Fri, 8am-4pm', 'Eye Care Clinic', '/uploads/female9.jpg', 'Provides vision care.'),
            ('Dr. Tina Copper', 'Psychiatrist', 12, '888-999-0000', 'tina.copper@example.com', 175.00, 'Mon-Thu, 10am-6pm', 'Mental Health Clinic', '/uploads/female10.jpg', 'Specializes in mental health care.'),
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
            `;
            await client.query(query);
            console.log("Successfully Inserted Data Into Doctors Table");
        } else {
            console.log("Doctors Table Already Has Data");
        }
    } catch (err) {
        console.error("Error Inserting Data Into Doctors Table", err);
    }
};
async function createTableusers() {
    const query = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(11) NOT NULL CHECK (LENGTH(mobile_number) = 11),
    gender VARCHAR(10) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    id_number VARCHAR(13) UNIQUE NOT NULL CHECK (LENGTH(id_number) = 13),
    issuance_Authority VARCHAR(255) NOT NULL,
    role VARCHAR(55) CHECK (role IN ('Patient','Doctor','Admin','Receptionist')),
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL
    )`
    try {
        await client.query(query);
        console.log("Users Table Created IF NOT exists");
    } catch (err) {
        console.error("Error Creating Table", err);
    }
}
async function createTabledoctors() {
    const query = `CREATE TABLE IF NOT EXISTS doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(155),
    specialization VARCHAR(55),
    experience INT,
    mobile_number VARCHAR(15),
    email VARCHAR(55),
    consultation_fees NUMERIC (10,2),
    availability TEXT,
    clinic VARCHAR(55),
    image_url TEXT,
    description TEXT 
    );`
    try {
        await client.query(query);
        console.log("Doctors Table Created IF NOT exists");
    } catch (err) {
        console.error("Error Creating Doctors Table", err);
    }
};
async function createTableAdmin() {
    const query = `CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(55) NOT NULL,
        email VARCHAR(55) UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        mobile_number VARCHAR(11) NOT NULL CHECK (LENGTH(mobile_number) = 11),
        gender VARCHAR(10) NOT NULL,
        occupation VARCHAR(100) NOT NULL,
        id_number VARCHAR(13) UNIQUE NOT NULL CHECK (LENGTH(id_number) = 13),
        issuance_Authority VARCHAR(255) NOT NULL,
        role VARCHAR(55) CHECK (role IN ('Patient','Doctor','Admin','Receptionist')),
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL
        )`
    try {
        await client.query(query);
        console.log("Admins Table Created IF NOT exists");
    } catch (err) {
        console.error("Error Creating Admins Table", err);
    }
}
app.post('/deleteM', async (req, res) => {
    const {
        medicineid, name
    } = req.body;
    try {
        const query1 = 'SELECT * FROM medicines WHERE medicineid = $1 AND name = $2';
        const result1 = await client.query(query1, [medicineid, name]);
        if (result1.rows.length === 0) {
            return res.render('deletemedicine', { errorMessage: 'Invalid medicineid or name Please try again' });
        }
        const query2 = 'DELETE FROM medicines WHERE medicineid = $1 AND name = $2';
        const result2 = await client.query(query2, [medicineid, name]);
        if (result2) {
            res.send("Successfully deleted row");
        }
    } catch (error) {
        console.error('Error Deleting Medicine', error);
        res.status(500).render('deletemedicine', { errorMessage: 'An error occurred while deleting the medicine. Please try again later.' });
    }
});
app.post("/deleteD", async (req, res) => {
    try {
        const {
            doctor_id, name
        } = req.body;
        const query1 = "SELECT * FROM doctors WHERE doctor_id = $1 AND name = $2";
        const result1 = await client.query(query1, [doctor_id, name]);
        if (result1.rows.length === 0) {
            return res.render('deletedoctor', { errorMessage: "Invalid Doctor ID or Doctor Name" });
        }
        const query2 = "DELETE FROM doctors WHERE doctor_id = $1 AND name = $2";
        await client.query(query2, [doctor_id, name]);
        res.redirect('/go-to-adminview-doctors');
    } catch (error) {
        console.error('Error Deleting Medicine', error);
        res.status(500).render('deletemedicine', { errorMessage: 'An error occurred while deleting the doctor. Please try again later.' });
    }
});
app.post("/AddM", async (req, res) => {
    try {
        const {
            name, price, stock_quantity, expiry_date
        } = req.body
        const query = `INSERT INTO medicines(image,name,price,stock_quantity,expiry_date)
        VALUES('/uploads/paracetamol',$1,$2,$3,$4)`;
        const result = await client.query(query, [name, price, stock_quantity, expiry_date]);
        res.redirect('/go-to-adminview-medicines');
    } catch (error) {
        console.error("Error Adding Medicine", error);
        res.status(500).send("Something went wrong while adding the medicine.");
    }
});
app.post("/register", async (req, res) => {
    const {
        full_name, email, date_of_birth, mobile_number, gender, occupation,
        id_number, issuance_authority, role, address, password, confirm_password
    } = req.body;

    if (password != confirm_password) {
        return res.render("form", { errorMessage: "❌Registration Failed As Passwords Do Not Match Please Try Again." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `INSERT INTO users
    (full_name, email, date_of_birth, mobile_number, gender, occupation,
    id_number, issuance_authority, role, address, password)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`;
        const result = await client.query(query, [full_name, email, date_of_birth, mobile_number, gender, occupation,
            id_number, issuance_authority, role, address, hashedPassword]);

        res.redirect('/login');
    } catch (err) {
        console.error("Error Inserting Data", err);
        res.status(500).send("<h2>❌ Registration Failed! Try Again.</h2>");
    }
})
app.post("/login", async (req, res) => {
    const {
        email, password
    } = req.body
    try {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await client.query(query, [email]);

        if (result.rows.length === 0) {
            return res.render('login', { errorMessage: "Invalid Email Or Password" });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render('login', { errorMessage: "Invalid Email Or Password" });
        }
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session Error",err);
                return res.status(500).render('error',{ message: "Login failed.Please try again later"});
            }
            req.session.user = {
                id: user.id,
                name: user.full_name,
                email: user.email
            };
            res.redirect('/landing');
        })
    } catch (err) {
        console.error("Login error", err);
        return res.status(500).send("<h2>❌ Login Failed! Please try again.</h2>");
    }
});
app.get("/go-to-doctors", async (req, res) => {
    try {
        const query = `SELECT * FROM doctors`;
        const result = await client.query(query);
        res.render('doctors_ui', { doctor: result.rows });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server Error");
    }
});
app.get("/go-to-medicines", async (req, res) => {
    try {
        const query = 'SELECT * FROM medicines';
        const result = await client.query(query);
        res.render('medicines_ui', { medicine: result.rows });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Server Error");
    }
});
app.get("/go-to-adminview-doctors", async (req, res) => {
    try {
        const query = `SELECT * FROM doctors`;
        const result = await client.query(query);
        res.render('adminviewdoctors', { doctor: result.rows });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server Error");
    }
})
app.get("/go-to-adminview-medicines", async (req, res) => {
    try {
        const query = `SELECT * FROM medicines`;
        const result = await client.query(query);
        res.render('adminviewmedicines', { medicine: result.rows });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server Error");
    }
});
app.get("/go-to-adminview-appointments", async (req, res) => {
    try {
        const query = `SELECT * FROM appointment`;
        const result = await client.query(query);
        res.render('appointments', { appointment: result.rows });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server Error");
    }
});
app.get("/register", (req, res) => {
    res.render('form', { errorMessage: null });
})
app.get("/login", (req, res) => {
    res.render('login');
})
app.get("/go-to-register", (req, res) => {
    res.render('form', { errorMessage: null })
})
app.get("/go-to-login", (req, res) => {
    res.render('login')
})
app.get("/landing", (req, res) => {
    console.log("Session User: ",req.session.user); // Check if session data is available
    res.render('landing_page', { user: req.session.user });
})
app.get("/go-to-deletedoctor", (req, res) => {
    res.render('deletedoctor')
})
app.get("/go-to-deletemedicine", async (req, res) => {
    res.render('deletemedicine')
})
app.get("/go-to-addmedicine", async (req, res) => {
    res.render('addmedicine')
})
app.get("/", (req, res) => {
    res.render('login');
})
app.listen(port, () => {
    console.log(`Server running on Port ${port}`)
    console.log(`Server is running at: http://localhost:${port}`);
})