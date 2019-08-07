var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Tyson4189$",
    database: "bamazon_db"
});

//connect to database and display products
connection.connect(function (err) {
    if (err) throw err;
    displayProducts();
});

//display products table
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("\n" + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock);
    }
  });
};

//Inquire about which ID and how many units to buy
function purchaseProducts() {
    inquirer
      .prompt({
        name: "id",
        type: "input",
        message: "Select item by ID #"
      })
      .then(function(answer) {
        console.log(answer.item_id);
        connection.query("SELECT * FROM products WHERE ?", { id: answer.item_id }, function(err, res) {
        displayProducts();
      });
   });
}