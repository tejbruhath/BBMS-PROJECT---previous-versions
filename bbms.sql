CREATE DATABASE blood_bank_management;
USE blood_bank_management;
CREATE TABLE donor (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    age INT,
    weight DECIMAL(5,2),
    gender CHAR(1),
    blood_group VARCHAR(5) NOT NULL,
    rh_factor VARCHAR(10) NOT NULL,
    city VARCHAR(50),
    mobile VARCHAR(15) NOT NULL
);
CREATE TABLE blood (
    code INT PRIMARY KEY AUTO_INCREMENT,
    blood_type VARCHAR(5) NOT NULL,
    quantity INT NOT NULL
);
CREATE TABLE blood_bank (
    orders INT PRIMARY KEY AUTO_INCREMENT,
    blood_type VARCHAR(5) NOT NULL,
    quantity INT NOT NULL
);
CREATE TABLE patient (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    gender CHAR(1),
    dob DATE,
    blood_group VARCHAR(5) NOT NULL,
    quantity INT NOT NULL,
    hospital_name VARCHAR(100),
    place VARCHAR(50)
);
INSERT INTO donor (first_name, middle_name, last_name, dob, age, weight, gender, blood_group, rh_factor, city, mobile)
VALUES ('John', 'M', 'Doe', '1995-05-15', 30, 75.5, 'M', 'A', 'Positive', 'New York', '1234567890');



