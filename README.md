# Bamazon
## Description:
Bamazon is an interactive store front available for customers to purchase items in stock. Bamazon also allows managers the flexibility to manage their inventory and to add new products when available.

## Bamazon Customer Interface:
The Bamazon Customer Interface allows users to view the current items available to purchase. The user will be prompted to enter the ID # and how many items they wish to purchase. If the item is in stock, the order will be completed and the user will see the total of their purchase:

![img](/images/customerView.png)

## Bamazon Manager Interface:
The Bamazon Manager Interface allows users to view and edit the inventory of their store:

![img](/images/managerOptions.png)

The first option allows the user to see the list of products that are currently for sale, what department the item belongs to, the price of the product and how much stock is left for that product:

![img](/images/managerOption1.png)

The second option allows the user to see a list of all inventory items that have less than 5 items in stock:

![img](/images/managerOption2.png)

The third option allows the user to update the inventory for a specific product. A prompt asks for the ID number of the product. A second prompt asks how many items they wish to add:

![img](/images/managerOption3.png)

The final option allows the user to add new product to the inventory. Prompts ask the user for the designated ID number, product name, department, price, and quantity:

![img](/images/managerOption4.png)

## Bamazon was created using the following technologies:
* Javascript
* nodeJS
* MySQL
* npm packages:
  * mysql
  * inquirer
  * cli-table