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