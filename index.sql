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

