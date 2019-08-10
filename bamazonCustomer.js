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

//Connect to database and display table
connection.connect(function (err) {
    if (err) throw err;
    storeFront();
    displayTable();
});

//Functions
//=========================================================================================
//Function to display welcome
function storeFront() {
    console.log(
        `
  ***********************************************************
                    WELCOME TO BAMAZON!
  ***********************************************************
          Here is a list of our current Merchandise:
`
    )
};

//Function to display products for sale
function displayTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Quantity"]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock]);
        };
        console.log(table.toString());
        order();
    });
};

//Function to prompt order
function order() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please select product to purchase by ID #",
        validate: (value) => {
            if (!isNaN(value) && (value > 0 && value <= 10)) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function (value) {
            if (!isNaN(value) && value > 0) {
                return true;
            } else {
                console.log("Please enter a value greater than 0");
                return false;
            }
        }
    }]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        var updateQuery = "UPDATE products SET stock=? WHERE item_id=?";
        connection.query(query, { item_id: answer.id }, function (err, res) {
            if (res[0].stock - answer.quantity >= 0) {

                var orderTotal = answer.quantity * res[0].price;

                console.log("We have enough " + res[0].product_name + " in stock");
                console.log("You will be charged $" + orderTotal + ". Thank you!");

                connection.query(updateQuery, [res[0].stock - answer.quantity, answer.id],
                    function (err) {
                        if (err) throw err;
                        newOrder();
                    })
            } else {
                console.log("Insufficient stock available. Please adjust your order. We only have " + res[0].stock + " " + res[0].product_name + " available." + "\n");
                newOrder();
            }
        });
    });
};

function newOrder() {
    inquirer.prompt([{
        name: 'newOrder',
        type: 'list',
        message: 'Would you like to place a new order?',
        choices: ['Yes', 'No']
    }]).then(function (answer) {
        if (answer.newOrder === 'Yes') {
            displayTable();
        } else {
            console.log('Thank you for your patronage!');
            process.exit();
        };
    });
};