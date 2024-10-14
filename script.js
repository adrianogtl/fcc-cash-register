const priceEl = document.querySelector("#price");
const changeDueEl = document.querySelector("#change-due");
const cashInput = document.querySelector("#cash");
const purchaseBtn = document.querySelector("#purchase-btn");
const cashDrawerEl = document.querySelector("#cash-drawer");

let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const addDollarFormat = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const updateCashInDrawer = () => {
  cashDrawerEl.innerHTML = "";
  cid.forEach(
    (currency) =>
      (cashDrawerEl.innerHTML += `<p>${currency[0]}: ${addDollarFormat(
        currency[1]
      )}</p>`)
  );
};

priceEl.textContent = `Total: ${addDollarFormat(price)}`;
updateCashInDrawer();

function checkCashRegister() {
  const cash = Number(cashInput.value);
  if (cash < price) {
    changeDueEl.textContent =
      "Customer does not have enough money to purchase the item";
    changeDueEl.classList.add("error");
    return;
  }

  if (cash === price) {
    changeDueEl.textContent = "No change due - customer paid with exact cash";
    changeDueEl.classList.remove("error");
    return;
  }

  const totalCid = +cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2);
  const changeDue = cash - price;
  // Count currency change from highest to lowest
  const currencyArr = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
  let cidChange = [
    ["PENNY", 0],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ];
  let changeYetDue = changeDue;
  for (let i = cid.length - 1; i >= 0; i--) {
    while (changeYetDue >= currencyArr[i] && cid[i][1] > 0) {
      changeYetDue -= currencyArr[i];
      changeYetDue = +changeYetDue.toFixed(2);
      cid[i][1] -= currencyArr[i];
      cidChange[i][1] += currencyArr[i];
    }
  }

  // Insufficient cash in drawer
  if (changeYetDue > 0 || totalCid < changeDue) {
    changeDueEl.textContent = "Status: INSUFFICIENT_FUNDS";
    changeDueEl.classList.add("error");
    return;
  }

  // Filter empty values and reverse cidChange
  cidChange = cidChange.filter((currency) => currency[1] !== 0).reverse();

  let changeMessage = "";
  cidChange.forEach(
    (currency) =>
      (changeMessage += `${currency[0]}: ${addDollarFormat(currency[1])} `)
  );

  if (totalCid === changeDue) {
    changeDueEl.textContent = `Status: CLOSED ${changeMessage}`;
    changeDueEl.classList.add("error");
  } else {
    changeDueEl.textContent = `Status: OPEN ${changeMessage}`;
    changeDueEl.classList.remove("error");
  }

  updateCashInDrawer();
  return;
}

purchaseBtn.addEventListener("click", checkCashRegister);
cashInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkCashRegister();
  }
});
