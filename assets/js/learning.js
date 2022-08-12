const GADGETS_CONTAINER = document.getElementById("gadgets_list_container-js");
const CART_COUNTER = document.getElementById("gadgets_counter-js");
const INVOICE_CONTAINER = document.getElementById("invoice_tbody-js");
const MODAL_CONTAINER = document.getElementById("modal__container-js");
const CART_ICON = document.getElementById("cart-icon-js");
const INVOICE_AMOUNT = document.getElementById("payable__amount-js");
const CONTINUE_SHOPPING_BTN = document.getElementById("btn--continue-js");
const CHECKOUT_BTN = document.getElementById("btn--checkout-js");

const AVAILABLE_GADGETS = [
  {
    id: 1,
    name: "Samsung TV",
    price: 500000,
  },
  {
    id: 2,
    name: "Pixel 4a",
    price: 250000,
  },
  {
    id: 3,
    name: "PS 5",
    price: 300000,
  },
  {
    id: 4,
    name: "MacBook Air",
    price: 800000,
  },
  {
    id: 5,
    name: "Apple Watch",
    price: 95000,
  },
  {
    id: 6,
    name: "Air Pods",
    price: 75000,
  },
];

let CART_ARRAY = [];
CART_COUNTER.innerHTML = CART_ARRAY.length;
CART_ICON.addEventListener("click", () =>
  MODAL_CONTAINER.classList.toggle("hidden")
);

function handleCounter(id, action) {
  switch (action) {
    case "decrement":
      console.log("-1");
      break;
    case "increment":
      console.log("+1");
      break;
    case "remove":
      console.log("remove");
      break;

    default:
      return;
  }
}

function createInvoice(cartArr) {
  return cartArr
    .map((item, index) => {
      return `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
          <button class="btn--counter" onclick="handleCounter(${
            item.id
          },'decrement')">-</button>
          <span class="option_counter_val">${item.quantity}</span>
          <button class="btn--counter" onclick="handleCounter(${
            item.id
          },'increment')">+</button>
      </td>
      <td><button class="btn invoice_btn--remove" onclick="handleCounter(${
        item.id
      },'remove')">remove</button></td>
    </tr>
    `;
    })
    .join("");
}

function renderInvoice({ invoice, totalAmount }) {
  INVOICE_CONTAINER.innerHTML = invoice;

  INVOICE_AMOUNT.innerHTML = totalAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "NGN",
  });
}

function calculateTotalPrice(cartArr) {
  const startingPrice = 0;
  let totalPrice = cartArr.reduce(
    (accumulatedPrice, item) => accumulatedPrice + item.price,
    startingPrice
  );
  return totalPrice;
}

function handleInvoiceProcess(cart) {
  const invoice = createInvoice(cart);
  const totalAmount = calculateTotalPrice(cart);
  renderInvoice({ invoice, totalAmount });
}

function updateCartCount(numberOfItems) {
  CART_COUNTER.innerHTML = numberOfItems;
  handleInvoiceProcess(CART_ARRAY);
}

function addToCart(gadget) {
  CART_ARRAY.push({ ...gadget, quantity: 1 });
}

function removeFromCart(gadget) {
  CART_ARRAY = CART_ARRAY.filter((item) => item.id !== gadget.id);
}

function changeBtnLabel(btn, action) {
  if (action === "add") {
    btn.className = "btn";
    btn.innerHTML = "add to cart";
    return;
  }
  btn.className = "btn btn--remove";
  btn.innerHTML = "remove from cart";
}

function isAlreadySelected(gadget) {
  return CART_ARRAY.find((elem) => elem.id === gadget.id);
}

function handleAddToCartProcess(event, index) {
  const selectedGadget = AVAILABLE_GADGETS[index];
  const feedback = isAlreadySelected(selectedGadget);

  if (feedback) {
    removeFromCart(feedback);
    changeBtnLabel(event.target, "add");
    updateCartCount(CART_ARRAY.length);
    return;
  }
  changeBtnLabel(event.target, "remove");
  addToCart(selectedGadget);
  updateCartCount(CART_ARRAY.length);
}

let gadgetList = AVAILABLE_GADGETS.map((item, index) => {
  return `
  <div class="shop1">
    <img src="./assets/img/product${item.id}.png">
    <p>${item.name}</p>
    <h3 id="p3">${item.price}</h3>
    <div>
    <button class="btn" onclick="handleAddToCartProcess(event, ${index})">add to cart</button>
    </div>
  </div>
  `;
}).join("");

GADGETS_CONTAINER.innerHTML = gadgetList;

// function payWithPaystack() {
//   let handler = PaystackPop.setup({
//     key: "pk_test_a3a21e27e5d115f49b289bbf9231c00dedc10e57", // Replace with your public key
//     email: document.getElementById("email-address").value,
//     amount: document.getElementById("amount").value * 100,
//     ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
//     // label: "Optional string that replaces customer email"
//     onClose: function () {
//       alert("Window closed.");
//     },
//     callback: function (response) {},
//   });

//   handler.openIframe();
// }
