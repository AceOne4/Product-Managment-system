"use strict";

const title = document.getElementById("title");
const price = document.getElementById("price");
const tax = document.getElementById("tax");
const ad = document.getElementById("ad");
const discount = document.getElementById("discount");
const total = document.getElementById("Total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const btnCreate = document.getElementById("submit");
const tableBody = document.getElementById("tableBody");
const btnDelAll = document.querySelector(".DeletAll");
const search = document.getElementById("search");
const btnSearchTitle = document.getElementById("searchTitle");
const btnSearchCat = document.getElementById("searchCategory");

//Global var
let mood = "create";
const totalEl = [price, tax, ad, discount];
let data, index;

//checking if there is data in local sorage

if (localStorage.item != null) data = JSON.parse(localStorage.item);
else data = [];

// Helper Functions

// Total Price
const totalPrice = function () {
  const Total = +price.value + +tax.value + +ad.value - +discount.value;
  total.style.backgroundColor = "green";
  return (total.innerHTML = `${Total}`);
};

//clearing field
const clearField = function () {
  title.value =
    price.value =
    tax.value =
    ad.value =
    discount.value =
    count.value =
    category.value =
    total.innerHTML =
      "";
  total.style.backgroundColor = "red";
};

//table Html
const htmlTable = function (el, i) {
  return `
  <tr>
  <td>${i + 1}</td>
<td>${el.title}</td>
<td>${el.price}</td>
<td>${el.tax}</td>
<td>${el.ad}</td>
<td>${el.discount}</td>
<td>${el.total}</t  d>
<td>${el.category}</td>
<td><button onclick="updateData(${i})" id="update" >update</button></td>
<td><button onclick="deletData(${i})" id="delete" >delete</button></td>
</tr>`;
};
//to Clear and implmenting Html
const implamentElment = function (markup) {
  tableBody.innerHTML = "";
  tableBody.insertAdjacentHTML("beforeend", markup);
};

const markupGenrator = function (data) {
  return data.map((el, i) => htmlTable(el, i)).join("");
};
// MAin Functions
//handling inputs
totalEl.forEach((el) =>
  el.addEventListener("keyup", function (e) {
    if (!price.value || !tax.value || !ad.value || !discount.value) {
      total.style.backgroundColor = "red";
      total.innerHTML = "";
    } else {
      totalPrice();
    }
  })
);

//handling create btn

const createItems = function (e) {
  const item = {
    title: title.value.toLowerCase(),
    price: price.value,
    tax: tax.value,
    ad: ad.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (
    !price.value ||
    !tax.value ||
    !ad.value ||
    !discount.value ||
    !title.value ||
    !category.value ||
    count.value > 500
  )
    return;

  if (mood === "create") {
    if (item.count > 1) {
      for (let i = 0; i < item.count; i++) {
        data.push(item);
      }
    } else {
      data.push(item);
    }
  } else {
    data[index] = item;
    mood = "create";
    count.classList.remove("hidden");
    btnCreate.innerHTML = "Create";
  }
  //render Data
  renderData();
  //save data at locaol storage
  localStorage.setItem("item", JSON.stringify(data));
  //Clear vlaues
  clearField();
  //checking To add Del All btn
  checkingToAddDelBtn();
};
btnCreate.addEventListener("click", createItems);

//render data
const renderData = function () {
  const markup = markupGenrator(data);
  implamentElment(markup);
};
renderData();

//delet one item
function deletData(i) {
  data.splice(i, 1);
  localStorage.item = JSON.stringify(data);
  renderData();
  checkingToAddDelBtn();
}

//delet all Items
const checkingToAddDelBtn = function () {
  if (data.length > 0) {
    btnDelAll.classList.remove("hidden");
    btnDelAll.textContent = `Delet All (${data.length})`;
  } else btnDelAll.classList.add("hidden");
};
checkingToAddDelBtn();

//handling the Del All btn
const deletAllData = function () {
  localStorage.clear();
  data.splice(0);
  renderData();
  btnDelAll.classList.add("hidden");
};

btnDelAll.addEventListener("click", deletAllData);

//update item
function updateData(i) {
  title.value = data[i].title;
  price.value = data[i].price;
  tax.value = data[i].tax;
  ad.value = data[i].ad;
  discount.value = data[i].discount;
  category.value = data[i].category;
  totalPrice();
  count.classList.add("hidden");
  btnCreate.innerHTML = "Update";
  mood = "update";
  index = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

//search

const searchingTitle = function () {
  const markUp = data
    .map((el, i) => {
      if (el.title.includes(search.value.toLowerCase()))
        return htmlTable(el, i);
    })
    .join("");

  implamentElment(markUp);
};

const searchingCat = function () {
  const markUp = data
    .map((el, i) => {
      if (el.category.includes(search.value.toLowerCase()))
        return htmlTable(el, i);
    })
    .join("");

  implamentElment(markUp);
};

btnSearchTitle.addEventListener("click", searchingTitle);

btnSearchCat.addEventListener("click", searchingCat);
