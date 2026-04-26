-- Run this file to initialize the database
-- Export your existing database using:
-- mysqldump -u root -p vacations > Database/init.sql
-- Then replace this file with the export

create database if not exists vacations;
use vacations;

create table if not exists users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    roleId TINYINT NOT NULL DEFAULT 2
);

create table if not exists `vacations-list` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255)
);

create table if not exists likes (
    userId INT NOT NULL,
    vacationId INT NOT NULL,
    primary key (userId, vacationId),
    foreign key (userId) references users(id) on delete cascade,
    foreign key (vacationId) references `vacations-list`(id) on delete cascade
);

-- Add an admin user with hashed password
-- Password: Admin123 (hashed with bcryptjs)
insert ignore into users (firstName, lastName, email, password, roleId)
values ('Admin', 'User', 'admin@vacation.com', '$2a$10$pQQM0u3Dz6YY6QBBJQqq..TsQLlKHMdD4H0h5hJ5pYf8v3hXhI.R.', 1);
