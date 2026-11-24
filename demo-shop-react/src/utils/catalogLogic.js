export function checkDiscount(productId, orders) {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const targetYear = prevMonth.getFullYear();
  const targetMonth = prevMonth.getMonth();

  for (let i = 0; i < orders.length; i++) {
    const orderDate = new Date(orders[i].order_date);
    if (orderDate.getFullYear() === targetYear && orderDate.getMonth() === targetMonth) {
      for (let j = 0; j < orders[i].items.length; j++) {
        if (orders[i].items[j].product_id === productId) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getProductData(product, categories, orders) {
  let totalQty = 0;
  for (let i = 0; i < product.variants.length; i++) {
    totalQty += product.variants[i].quantity;
  }

  const hasOrders = checkDiscount(product.id, orders);
  const discount = hasOrders ? 0 : 25;
  const finalPrice = Math.round(product.base_price * (1 - discount / 100));

  let catName = "Без категории";
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === product.category_id) {
      catName = categories[i].name;
    }
  }

  return {
    ...product,
    totalQty: totalQty,
    isLow: totalQty > 0 && totalQty <= 3,
    discount: discount,
    finalPrice: finalPrice,
    categoryName: catName,
  };
}