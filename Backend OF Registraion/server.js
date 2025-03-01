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
        createTable(); // Call The Functin to create The Table
    })
    .catch((err) => console.error("Error Connecting To Database(postgres)", err.stack));

const client2 = new Client({
    user: "postgres",
    host: "localhost",
    database: "Pharmacy",
    password: "Pakistan98765",
    port: 5432
});
client2.connect()
    .then(() => {
        console.log("Connected To PostgreSQL(Pharmacy)")
        createTable(); // Call The Functin to create The Table
    })
    .catch((err) => console.error("Error Connecting To Database(Pharmacy)", err.stack));

app.get("/", (req, res) => {
    res.render('landing_page');
})
async function createTable() {
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

app.post("/register" , async (req,res) => {
    const {
        full_name, email, date_of_birth, mobile_number, gender, occupation,
        id_number, issuance_authority, role, address, password ,confirm_password
    } = req.body;

    if (password != confirm_password)
    {
        return res.render("form",{ errorMessage : "❌Registration Failed As Passwords Do Not Match Please Try Again."});
    }

    try
    {
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    const query = `INSERT INTO users
    (full_name, email, date_of_birth, mobile_number, gender, occupation,
    id_number, issuance_authority, role, address, password)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`;
    const result = await client.query(query , [full_name, email, date_of_birth, mobile_number, gender, occupation,
        id_number, issuance_authority, role, address, hashedPassword]);

    res.send(`<h2> Registration Successful! Welcome, ${result.rows[0].full_name}`)    
    } catch (err) {
        console.error("Error Inserting Data",err);
        res.status(500).send("<h2>❌ Registration Failed! Try Again.</h2>");
    }
})
app.post("/login", async (req,res) => {
    const {
        email,password
    } = req.body
    try
    {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await client.query(query,[email]);

        if (result.rows.length === 0)
        {
            return res.render('login',{errorMessage: "Invalid Email Or Password Please Try Again"});
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password,user.password);

        if (passwordMatch) {
            res.send(`<h2> Login Successful! You Are Most Welcome </h2> ${result.rows[0].full_name}`);
        }
        else 
        {
            return res.render('login',{errorMessage: "Incorrect Password! Please Try Again"})
        }
    } catch (err) 
    {
        console.error("Login error",error);
        return res.status(500).send("<h2>❌ Login Failed! Please try again.</h2>");
    }
})
app.get("/go-to-doctors",async (req,res) => {
    try
    {
        const query = `SELECT * FROM doctors`;
        const result = await client.query(query);
        res.render('doctors_ui',{doctor: result.rows});
    } catch (err) {
        console.error("Error fetching data:",err);
        res.status(500).send("Server Error");
    }
});
app.get("/register",(req,res) => {
    res.render('form',{errorMessage: null});
})
app.get("/login",(req,res) => {
    res.render('login');
})
app.get("/go-to-register",(req,res) => {
    res.render('form',{errorMessage: null})
})
app.get("/go-to-login",(req,res) => {
    res.render('login')
})
app.listen(port, () => {
    console.log(`Server running on Port ${port}`)
})