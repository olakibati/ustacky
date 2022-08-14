const GADGETS_CONTAINER = document.getElementById("gadgets_list_container-js");
const CART_ITEMS_COUNTER = document.getElementById("gadgets_counter-js");
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
    basePrice: 500000,
  },
  {
    id: 2,
    name: "Pixel 4a",
    basePrice: 250000,
  },
  {
    id: 3,
    name: "PS 5",
    basePrice: 300000,
  },
  {
    id: 4,
    name: "MacBook Air",
    basePrice: 800000,
  },
  {
    id: 5,
    name: "Apple Watch",
    basePrice: 95000,
  },
  {
    id: 6,
    name: "Air Pods",
    basePrice: 75000,
  },
];

let CART_ARRAY = [];
updateCartCount();
CART_ICON.addEventListener("click", () => {
  MODAL_CONTAINER.classList.toggle("hidden");
  formValidationProcess.addListeners();
});
CONTINUE_SHOPPING_BTN.addEventListener("click", () =>
  MODAL_CONTAINER.classList.toggle("hidden")
);
CHECKOUT_BTN.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
  // getFormValues();
  payWithPaystack();
});

const formValidationProcess = {
  form: document.getElementById("form__container-js"),

  formElements: {
    input: {
      name: document.getElementById("input--name--js"),
      mailAddress: document.getElementById("input--email--js"),
      tel: document.getElementById("input--tel--js"),
    },

    error: {
      name: document.getElementById("error-name-js"),
      mailAddress: document.getElementById("error-email-js"),
      tel: document.getElementById("error-tel-js"),
    },

    submitBtn: document.getElementById("btn--checkout-js"),
  },

  validStatus: {
    name: false,
    mailAddress: false,
    tel: false,
  },

  setStatus: function (elem, status) {
    this.validStatus[elem] = status;
    // console.log(this.validStatus);
    // console.log(`${elem} is ${status}`);
  },

  btnStatus: function () {
    // console.log(inputElem);
    const response = Object.values(this.validStatus).includes(false);
    // console.log(this.formElements.submitBtn);
    this.formElements.submitBtn.disabled = response;
    // response ? console.log("btn disabled") : console.log("btn enabled");
  },

  addError: function (inputBox, errElem, errMssg) {
    this.setStatus(inputBox.name, false);
    errElem.textContent = errMssg;
    errElem.classList.remove("hidden");
    inputBox.classList.add("input--error");
    inputBox.parentElement.classList.add("label--error");

    // console.log(inputBox);
  },

  removeError: function (inputBox, errElem) {
    this.setStatus(inputBox.name, true);
    inputBox.classList.remove("input--error");
    inputBox.parentElement.classList.remove("label--error");
    errElem.classList.add("hidden");
  },

  addListeners: function () {
    let input = this.formElements.input;

    for (const [inputName, inputElem] of Object.entries(input)) {
      inputElem.addEventListener("keyup", (e) => {
        this.checkInput(
          e.target,
          inputName,
          this.formElements.error[inputName]
        );

        this.btnStatus();
      });
    }
  },

  checkEmail: function (param) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      param
    );
  },

  checkTelephone: function (param) {
    return /1?[\s-]?\(?(\d{3})\)?[\s-]?\d{3}[\s-]?\d{4}/.test(param);
  },

  checkInput: function (inputBox, inputName, inputError) {
    const inputVal = inputBox.value.trim();

    if (!inputVal) {
      this.addError(inputBox, inputError, "Field cannot be empty");
      return;
    }

    switch (inputName) {
      case "mailAddress":
        if (!this.checkEmail(inputVal)) {
          this.addError(inputBox, inputError, "Provide a valid email address");
          return;
        }
        this.removeError(inputBox, inputError);
        break;

      case "tel":
        if (!this.checkTelephone(inputVal)) {
          this.addError(inputBox, inputError, "Invalid telephone");
          return;
        }
        this.removeError(inputBox, inputError);
        break;

      default:
        if (inputVal.length < 2) {
          this.addError(
            inputBox,
            inputError,
            "Value cannot be lower than two characters"
          );
          return;
        }

        this.removeError(inputBox, inputError);
        break;
    }
  },
};

function handleCounter(selectedItemId, action) {
  switch (action) {
    case "decrement":
      CART_ARRAY = CART_ARRAY.map((item, index) => {
        if (item.id === selectedItemId && item.quantity === 1) {
          alert(
            "You cannot have less than one item. If you wish to remove this item, click remove"
          );
          return item;
        }

        if (item.id === selectedItemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
            totalPrice: item.basePrice * (item.quantity - 1),
          };
        }

        return item;
      });
      break;
    case "increment":
      CART_ARRAY = CART_ARRAY.map((item, index) => {
        if (item.id === selectedItemId) {
          return {
            ...item,
            totalPrice: item.basePrice * (item.quantity + 1),
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      break;
    case "remove":
      const response = confirm("Are you sure you want to remove this item?");
      const [gadgetToBeRemoved] = CART_ARRAY.filter(
        (item) => item.id === selectedItemId
      );
      if (response) removeFromCart(gadgetToBeRemoved);
      break;
    default:
      alert("invalid action");
      return;
  }
  handleInvoiceProcess(CART_ARRAY);
}

function createInvoice(cartArr) {
  return cartArr
    .map((item, index) => {
      // ${(item.totalPrice ?? item.basePrice).toLocaleString("en-US")}
      return `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>
        ${item.basePrice.toLocaleString("en-US")}

      </td>
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
    (accumulatedPrice, item) =>
      accumulatedPrice + (item.totalPrice ?? item.basePrice),
    startingPrice
  );
  return totalPrice;
}

function handleInvoiceProcess(cart) {
  const invoice = createInvoice(cart);
  const totalAmount = calculateTotalPrice(cart);
  renderInvoice({ invoice, totalAmount });
}

function updateCartCount() {
  CART_ITEMS_COUNTER.innerHTML = CART_ARRAY.length;
  handleInvoiceProcess(CART_ARRAY);
}

function addToCart(gadget) {
  CART_ARRAY.push(gadget);
  updateCartCount();
}

function removeFromCart(gadget) {
  CART_ARRAY = CART_ARRAY.filter((item) => item.id !== gadget.id);
  updateCartCount();
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
    updateCartCount();
    return;
  }
  changeBtnLabel(event.target, "remove");
  addToCart({ ...selectedGadget, quantity: 1 });
  updateCartCount();
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

function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: "pk_test_a3a21e27e5d115f49b289bbf9231c00dedc10e57",
    email: formValidationProcess.formElements.input.mailAddress.value.trim(),
    amount: calculateTotalPrice(CART_ARRAY) * 100,
    onClose: function () {
      alert("Transaction was not completed, window closed.");
    },
    callback: function (response) {
      alert(response);
    },
  });
  handler.openIframe();
}
