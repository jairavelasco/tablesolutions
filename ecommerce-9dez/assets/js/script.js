$(document).ready(function () {
  function getProductsStorage() {
    let products = localStorage.getItem("products");
    if (products == null) {
      localStorage.setItem("products", JSON.stringify([]));
    }

    return JSON.parse(products);
  }

  function findProductInStorage(productID) {
    let products = getProductsStorage();
    return products.find((product) => {
      return product.id == productID;
    });
  }

  function findProductInStorageByIndex(productID) {
    let products = getProductsStorage();
    return products.findIndex((product) => {
      return product.id == productID;
    });
  }

  function reduce(array) {
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;

    return array.reduce(reducer);
  }

  function getTotalUnitPrice() {
    let products = getProductsStorage();
    let prices = products.map((product) => {
      return product.price;
    });

    return CADFormat(reduce(prices));
  }

  function getTotalAmount() {
    let products = getProductsStorage();
    let prices = products.map((product) => {
      return product.amount;
    });

    return reduce(prices);
  }

  function getTotalPrice() {
    let products = getProductsStorage();
    let prices = products.map((product) => {
      return product.price * product.amount;
    });

    return CADFormat(reduce(prices));
  }

  function changeProductAmountInStorage(productID, amount) {
    let findProductIndex = findProductInStorageByIndex(productID);
    let products = getProductsStorage();

    products[findProductIndex].amount = parseInt(amount);

    $(".total-" + findProductIndex).html(
      `CAD<b>$</b> ${CADFormat(
        products[findProductIndex].price * products[findProductIndex].amount
      )}`
    );

    localStorage.setItem("products", JSON.stringify(products));
  }

  function updateAllProductValues() {
    $("#total_cart").text(sumCartProducts());
    $("td.total_price").html("CAD<b>$</b> " + getTotalUnitPrice());
    $("td.total_amount").html(getTotalAmount() + " UN");
    $("td.total_value").html("CAD<b>$</b> " + getTotalPrice());
  }

  function updateTableProducts() {
    if (getProductsStorage() != null && getProductsStorage().length > 0) {
      let products = getProductsStorage();

      products.forEach((product, index) => {
        $("table tbody.table-products").append(
          `
                  <tr class="product" id="${product.id}">
                      <td class="image"><img src="assets/images/${
                        product.image
                      }" width="50" height="50"/></td>
                      <td class="name">${product.name}</td>
                      <td class="price">CAD<b>$</b> ${CADFormat(
                        product.price
                      )}</td>
                      <td class="amount"><input class="form-control" type="number" value="${
                        product.amount
                      }" min="1" max="10" placeholder="Quantity" required /></td>
                      <td class="total total-${index}">CAD<b>$</b> ${CADFormat(
            product.price * product.amount
          )}</td>
                      <td><button href="#" class="remove btn btn-danger"><i class="fa fa-times"></i></button></td>
                  </tr>
                  `
        );
      });
    }
  }

  function CADFormat(value) {
    return value.toFixed(2);
  }

  function sumCartProducts() {
    const array = [];
    let products = getProductsStorage();

    products.forEach((product) => {
      array.push(product.amount);
    });

    return reduce(array);
  }

  $(".add-to-cart").click(function () {
    let products = [];
    let productStorage = JSON.parse(localStorage.getItem("products"));
    if (productStorage != null) {
      products = productStorage;
    }

    let button = $(this);
    let parent = button.parent();
    let productID = parseInt(parent.attr("id"));

    let find = findProductInStorage(productID);
    let findIndex = findProductInStorageByIndex(productID);

    if (find == undefined) {
      let jsonProduct = {
        id: productID,
        name: parent.attr("name"),
        price: parseFloat(parent.attr("price")),
        image: parent.attr("image"),
        amount: 1,
      };

      products.push(jsonProduct);
    } else {
      products[findIndex].amount++;
    }

    localStorage.setItem("products", JSON.stringify(products));

    getProductsStorage();
    updateAllProductValues();

    $.toast({
      heading: "Success",
      text: "The product has been added to the cart.",
      showHideTransition: "slide",
      icon: "success",
      hideAfter: 2500,
    });
  });

  updateTableProducts();

  $(".amount input").on("change", function (e) {
    let amount = e.target.value;
    let productID = parseInt($(this).parent().parent().attr("id"));

    changeProductAmountInStorage(productID, amount);

    getProductsStorage();
    updateAllProductValues();
  });

  updateAllProductValues();

  $("table tbody.table-products").on("click", "button", function () {
    let button = $(this);
    let productID = parseInt(button.parent().parent().attr("id"));
    let productIndex = findProductInStorageByIndex(productID);

    let products = getProductsStorage();
    products.splice(productIndex, 1);

    localStorage.setItem("products", JSON.stringify(products));

    window.location.reload();

    // $("table tbody.table-products").html("");

    // updateTableProducts();
    // updateAllProductValues();
  });

  $(".reset").click(function (e) {
    e.preventDefault();

    $("input[name=first_name]").val("");
    $("input[name=last_name]").val("");
    $("select[name=product]").val("");
    $("textarea[name=message]").val("");
    $("select[name=board_games]").val("");
    $("select[name=services]").val("");
    $("textarea[name=support]").val("");
  });
});
