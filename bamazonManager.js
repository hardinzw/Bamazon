//Setup
//=========================================================================================
require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.db_password,
    database: "bamazon_db"
});

//Connect to database
connection.connect(function (err) {
    if (err) throw err;
    start();
});

//Function to prompt manager input
function start() {
    inquirer.prompt([{
        type: "list",
        name: "managerOptions",
        message: "What would you like to do?",
        choices: [
            "View products for sale",
            "View low inventory",
            "Add to inventory",
            "Add new product",
            "No changes necessary"
        ]
    }]).then(function(answer) {
        if (answer.managerOptions === "View products for sale") {
            viewInventory();
        } else if (answer.managerOptions === "View low inventory") {
            viewLowInventory();
        } else if (answer.managerOptions === "Add to inventory") {
            addInventory();
        } else if (answer.managerOptions === "Add new product") {
            addProduct();
        } else if (answer.managerOptions === "No changes necessary") {
            console.log("Have a great rest of your day");
            process.exit();
        }
    });
};

//Function to view all products
function viewInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Quantity"]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock]);
        };
        console.log(table.toString());
        start();
    });
};

//Function to view low inventory products
function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Quantity"]
        });

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock < 5) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock]);
        };
    };
        console.log(table.toString());
        start();
    });
};

//Function to increase inventory of selected products
function addInventory() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please select inventory by product ID #",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to add?",
        validate: function (value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        var updateQuery = "UPDATE products SET ? WHERE ?";
        connection.query(query, { item_id: answer.id }, function (err, res) {
            if (err) throw err;
            console.log("You have added " + answer.quantity + ' ' + res[0].product_name + " to the inventory.");

        connection.query(updateQuery, [{ stock: parseInt(res[0].stock) + parseInt(answer.quantity) }, { item_id: answer.id }], function (err, inventory) {
            start();
            });    
        });
    });
};

//Function to add product to table
function addProduct() {
   inquirer.prompt([
       {
           type: "input",
           name: "id",
           message: "What will the ID number of this item be?"
       }, {
           type: "input",
           name: "name",
           message: "What item would you like to add?"
       }, {
           type: "input",
           name: "department",
           message: "In which department will this item be located?"
       }, {
           type: "input",
           name: "price",
           message: "What is the retail value of this item?"
       }, {
           type: "input",
           name: "quantity",
           message: "How many of this item do you have in stock?"
       }
   ]).then(function(answer) {
       connection.query("INSERT INTO products SET ?", {
           item_id: answer.id,
           product_name: answer.name,
           department_name: answer.department,
           price: answer.price,
           stock: answer.quantity
       }, function(err) {
           if (err) throw err;
           console.log(answer.name + " was added successfully!");
           start();
       });
   }); 
};
