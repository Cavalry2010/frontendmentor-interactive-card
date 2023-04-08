"use strict";

class RegisterCC {
  imageDate = {
    name: document.querySelector(".cc-image-name"),
    number: document.querySelector(".cc-image-number"),
    month: document.querySelector(".cc-expire-month"),
    year: document.querySelector(".cc-expire-year"),
    cvc: document.querySelector(".cc-image-cvc"),
  };
  inputs = {
    name: document.getElementById("full-name"),
    number: document.getElementById("cc-number"),
    month: document.getElementById("expire-month"),
    year: document.getElementById("expire-year"),
    cvc: document.getElementById("cc-cvc"),
  };
  form = document.querySelector(".cc-register-form");

  constructor() {
    this.form.setAttribute("novalidate", "novalidate");
    this.form.addEventListener("input", this.checkInputs.bind(this));
    this.form.addEventListener("submit", this.checkValues.bind(this));
  }

  checkInputs() {
    for (const [inputKey, inputValue] of Object.entries(this.inputs)) {
      for (const [imageKey, imageText] of Object.entries(this.imageDate)) {
        if (inputKey === imageKey && inputValue.value !== "") {
          imageText.textContent = inputValue.value;
          if (inputKey === "name") {
            const input = inputValue.value.substring(0, 25);
            imageText.textContent = input;
            inputValue.value = input;
          }
          if (inputKey === "number") {
            const input = inputValue.value.substring(0, 19).replace(/\D/g, "");
            const formattedInput = input.replace(/(\d{4})/g, "$1 ");
            imageText.textContent = formattedInput.trim();
            inputValue.value = formattedInput.trim();
          }
          if (inputKey === "month" || inputKey === "year") {
            const input = inputValue.value.substring(0, 2);
            imageText.textContent = input;
            inputValue.value = input;
          }
          if (inputKey === "cvc") {
            const input = inputValue.value.substring(0, 3);
            imageText.textContent = input;
            inputValue.value = input;
          }
        } else if (inputKey === imageKey && inputValue.value === "") {
          if (inputKey === "name") {
            imageText.textContent = "Jane Appleseed";
          }
          if (inputKey === "number") {
            imageText.textContent = "0000 0000 0000 0000";
          }
          if (inputKey === "month" || inputKey === "year") {
            imageText.textContent = "00";
          }
          if (inputKey === "cvc") {
            imageText.textContent = "000";
          }
        }
      }
    }
  }

  checkValues(e) {
    e.preventDefault();
    let month;
    let valuesGood = 0;

    for (const [key, value] of Object.entries(this.inputs)) {
      if (value.value !== "") {
        if (key === "number") {
          const regex = new RegExp("^[0-9]{16}$");
          const cardNumber = value.value.split(" ").join("");

          if (!regex.test(cardNumber) || !this.luhnCheck(cardNumber)) {
            this.showError(value, "Please provide a valid card number");
            return;
          }
        }
        if (key === "month") {
          const monthNum = Number(value.value);
          if (!monthNum || !(monthNum >= 1 && monthNum <= 12)) {
            this.showError(value, "Must be a valid month");
            return;
          } else {
            month = monthNum;
          }
        }
        if (key === "year") {
          const yearNum = Number("20" + value.value);
          const curDate = new Date();
          const cardDate = new Date(yearNum, month - 1, 1);
          if (cardDate < curDate) {
            this.showError(value, "This card is expired");
            return;
          }
        }
        this.removeError(value);
        valuesGood++;
      }
      if (value.value === "") {
        this.showError(value, "Can't be blank");
      }
    }
    if (valuesGood === 5) {
      this.showSucess();
    }
  }

  showError(input, message) {
    const divElement = input.closest("div");

    const alert =
      Array.from(divElement.children)[2].tagName === "P"
        ? Array.from(divElement.children)[2]
        : divElement.lastElementChild;
    alert.textContent = message;
    input.style.outline = "none !important";
    input.style.border = "1px solid #ff5252";
    divElement.classList.add("invalid-input", "invalid-margin-btm");
  }

  removeError(input) {
    const divElement = input.closest("div");
    input.style.border = "solid 1px #dedddf";
    divElement.classList.remove("invalid-input", "invalid-margin-btm");
  }

  showSucess() {
    const formBox = this.form.closest(".cc-register-form-box");
    formBox.classList.add("cc-register-form--hidden");
    setTimeout(function () {
      formBox.innerHTML = `
      <img
        class="success-img"
        src="./images/icon-complete.svg"
        alt="Completed"
      />
      <p class="completed-ty">Thank you!</p>
      <p class="completed-message">We've added your card details</p>
      <a href="#" class="continue-btn">Continue</a>`;
      formBox.classList.add("cc-register-success");
      formBox.classList.remove("cc-register-form--hidden");
    }, 300);
  }

  luhnCheck(num) {
    let arr = (num + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
      (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
      0
    );
    sum += lastDigit;
    return sum % 10 === 0;
  }
}

const cc = new RegisterCC();
