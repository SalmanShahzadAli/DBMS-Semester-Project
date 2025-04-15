const { Client } = require("pg");
const express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { error } = require("console");

const saltRounds = 10;
const port = 3000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


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
    })
    .catch((err) => console.error("Error Connecting To Database(postgres)", err.stack));

app.get("/", (req, res) => {
    res.render('landing_page');
})
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
            doctor_name VARCHAR(100) NOT NULL,
            specialization VARCHAR(100) NOT NULL,
            years_experience INTEGER,
            mobile_number VARCHAR(20) NOT NULL,
            email VARCHAR(100) NOT NULL,
            doctor_description TEXT,
            patient_name VARCHAR(100),
            patient_email VARCHAR(100),
            appointment_date TIMESTAMP,
            appointment_status VARCHAR(20) DEFAULT 'Pending',
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
}
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
app.post('/deleteM', async (req,res) => {
    const {
        medicineid,name
    } = req.body;
    try {
        const query1 = 'SELECT * FROM medicines WHERE medicineid = $1 AND name = $2';
        const result1 = await client.query(query1,[medicineid,name]);
        if (result1.rows.length === 0) {
        return res.render('deletemedicine',{errorMessage : 'Invalid medicineid or name Please try again'});
        }
        const query2 = 'DELETE FROM medicines WHERE medicineid = $1 AND name = $2';
        const result2 = await client.query(query2,[medicineid,name]);
        if (result2) {
        res.send("Successfully deleted row");
        }
    } catch (error) {
        console.error('Error Deleting Medicine',error);
        res.status(500).render('deletemedicine', { errorMessage: 'An error occurred while deleting the medicine. Please try again later.' });
    }
});
app.post("/AddM",async(req,res) => {
    try {
        const {
            name,price,stock_quantity,expiry_date
        } = req.body
        const query = `INSERT INTO medicines(image,name,price,stock_quantity,expiry_date)
        VALUES('/uploads/paracetamol',$1,$2,$3,$4)`;
        const result = await client.query(query,[name,price,stock_quantity,expiry_date]);
        res.redirect('/go-to-medicines')
    } catch (error) {
        console.error("Error Adding Medicine",error);
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
            return res.render('login', { errorMessage: "Invalid Email Or Password Please Try Again" });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.send(`<h2> Login Successful! You Are Most Welcome </h2> ${result.rows[0].full_name}`);
        }
        else {
            return res.render('login', { errorMessage: "Incorrect Password! Please Try Again" })
        }
    } catch (err) {
        console.error("Login error", error);
        return res.status(500).send("<h2>❌ Login Failed! Please try again.</h2>");
    }
})
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
app.get("/go-to-deletemedicine",async (req,res) => {
    res.render('deletemedicine')
})
app.get("/go-to-addmedicine",async (req,res) => {
    res.render('addmedicine')
})
app.get("/go-to-medicines",async (req,res) => {
    try {
        const query = 'SELECT * FROM medicines';
        const result = await client.query(query);
        res.render('medicines_ui',{medicine: result.rows});
    } catch (error) {
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
app.get("/landing",(req,res) => {
    res.render('landing_page')
})
app.listen(port, () => {
    console.log(`Server running on Port ${port}`)
})