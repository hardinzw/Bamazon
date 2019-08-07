USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Tyson4189$';
GRANT ALL PRIVILEGES ON bamazon_db.* TO 'root'@'localhost';

DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

create table products(
item_id INTEGER not null,
product_name VARCHAR(100) not null,
department_name VARCHAR(100) not null,
price DECIMAL (13,2) null,
stock INTEGER null,
PRIMARY KEY (item_id)
);

SELECT * FROM products;