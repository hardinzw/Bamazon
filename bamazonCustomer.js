//Setup
//=========================================================================================
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Tyson4189$",
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
              Thank you for shopping with us!
  ***********************************************************
          Here is a list of our current Merchandise.
          See anything you like?
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
        }
        console.log(table.toString());
        order();
    });
};

//Function to select ID number
function order() {
    inquirer.prompt({
        name: "itemID",
        type: "input",
        message: "Please select product to purchase by ID #",
        validate: (value) => {
            if (!isNaN(value) && (value > 0 && value <= 10)) {
                return true;
            } else {
                return false;
            }
        }
    }).then(function (answer1) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer1.itemID }, function (err, res) {
            var table = new Table({
                head: ["ID", "Product Name", "Department", "Price", "Stock Quantity"]
            });

            for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock]);
            }
            console.log(table.toString());
            itemQuantity();
        });
    });
};

//Function to select quantity to purchase
function itemQuantity() {
    inquirer
        .prompt({
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
        }).then(function (answer) {
            var query = "SELECT stock FROM products WHERE ?";
            connection.query(query, { item_id: answer.quantity }, function (err, res) {

                //If there is not enough stock available
                if (res[0].stock < answer.quantity) {
                    console.log("Insufficient quantity to process order.");
                    inquirer.prompt({
                        name: 'proceed',
                        type: 'confirm',
                        message: 'Would you like to edit your order?'
                    }).then(function (answer) {
                        if (answer.proceed) {
                            itemQuantity();
                        } else {
                            console.log("\n\tThanks for visiting! We hope to see you again soon.");
                            connection.end();
                        }
                    });
                    //If there is enough stock available    
                } else {
                    console.log("processing order")
                }
            });
        });
};
