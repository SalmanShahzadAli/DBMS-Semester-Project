const { Client } = require("pg");
const express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs")

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
        console.log("Connected To PostgreSQL")
        createTable(); // Call The Functin to create The Table
    })
    .catch((err) => console.error("Error Connecting To Database", err.stack));

app.get("/", (req, res) => {
    res.render('form',{errorMessage: null});
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
app.listen(port, () => {
    console.log(`Server running on Port ${port}`)
});