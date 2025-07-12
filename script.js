// Get references to DOM elements
const itemNameInput = document.getElementById("item-name");
const itemPriceInput = document.getElementById("item-price");
const itemQuantityInput = document.getElementById("item-quantity");
const addButton = document.getElementById("add-btn");

const cartList = document.getElementById("cart-list");
const totalDisplay = document.getElementById("total-display");
const clearButton = document.getElementById("clear-btn");
const searchInput = document.getElementById("search-input");
const currencySelect = document.getElementById("currency-select");
let selectedCurrency = "₦"; 

// Store items in cart
let cart = [];

loadCartFromServer();

// const savedCart = localStorage.getItem("myCart");
// if (savedCart) {
//     cart = JSON.parse(savedCart); 
//     displayCart();                 
//     updateTotal();                 
// }

async function loadCartFromServer() {
    try {
        const response = await fetch("cart-data.json");
        if (!response.ok) {
            throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        cart = data.cart;
        displayCart();
        updateTotal();
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

currencySelect.addEventListener("change", function () {
    selectedCurrency = currencySelect.value;
    displayCart(searchInput.value.trim().toLowerCase()); 
    updateTotal();
});

// Add Item to Cart
addButton.addEventListener("click", function () {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    const quantity = parseInt(itemQuantityInput.value);

    if (name === "" || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        alert("Please enter valid item name, price, and quantity.");
        return;
    }

    const newItem = {
        name: name,
        price: price,
        quantity: quantity
    };
    cart.push(newItem);
    saveCart();

    displayCart();
    updateTotal();

    // Clear input fields
    itemNameInput.value = "";
    itemPriceInput.value = "";
    itemQuantityInput.value = "";
});

clearButton.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Cart is already empty.");
        return;
    }

    const confirmClear = prompt("Are you sure you want to clear the entire cart?");
    if (confirmClear) {
        cart.length = 0;
        displayCart();
        updateTotal();
        saveCart();
        alert("Cart has been cleared successfully.")
    }
});

searchInput.addEventListener("keyup", function() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    displayCart(searchTerm);
});

// Display Cart Items
function displayCart(filter = "") {
    cartList.innerHTML = "";

    const filteredItems = cart.filter(item => 
        item.name.toLowerCase().includes(filter)
    );

    if (filteredItems === 0) {
        cartList.innerHTML = "<li>No matching items found.</li>";
        return;
    }

    filteredItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${selectedCurrency}${item.price} x ${item.quantity} = ${selectedCurrency}${item.price * item.quantity}`;

        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", function () {
            removeItem(index);
        });

        // Update button
        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.style.marginLeft = "10px";
        updateBtn.addEventListener("click", function () {
            updateItem(index);
        });

        li.appendChild(removeBtn);
        li.appendChild(updateBtn);
        cartList.appendChild(li);
    });
}

// Update an Item
function updateItem(index) {
    const item = cart[index];

    const newPriceInput = prompt(`Enter new price for "${item.name}" (current: ${selectedCurrency}${item.price}):`);
    const newQuantityInput = prompt(`Enter new quantity for "${item.name}" (current: ${item.quantity}):`);

    const newPrice = parseFloat(newPriceInput);
    const newQuantity = parseInt(newQuantityInput);

    if (
        isNaN(newPrice) || newPrice <= 0 ||
        isNaN(newQuantity) || newQuantity <= 0
    ) {
        alert("Invalid input. Please enter positive numbers.");
        return;
    }

    item.price = newPrice;
    item.quantity = newQuantity;

    alert(`"${item.name}" updated successfully.`);
    displayCart();
    updateTotal();
    saveCart();
}

// Remove an Item
function removeItem(index) {
    const confirmDelete = prompt(`Are you sure you want to remove "${cart[index].name}" from your cart?`)
    if (!confirmDelete) {
    return;
    }
    const removed = cart.splice(index, 1);
    alert(`"${removed[0].name}" removed from cart.`);

    displayCart();
    updateTotal();
    saveCart();
}

// Calculate and display total
function updateTotal() {
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    totalDisplay.textContent = `Total: ${selectedCurrency}${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem("myCart", JSON.stringify(cart));

    console.log("Simulating API call...");
    console.log("Sending cart to backend:", cart);
}