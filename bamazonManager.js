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
        if (answer.mngrOption === 'View products for sale') {
            viewInventory();
        } else if (answer.mngrOption === 'View low inventory') {
            viewLowInventory();
        } else if (answer.mngrOption === 'Add to inventory') {
            addInventory();
        } else if (answer.mngrOption === 'Add new products') {
            addProduct();
        } else if (answer.mngrOption === "No changes necessary") {
            console.log("Have a great rest of your day");
            process.exit();
        }
    });
};

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