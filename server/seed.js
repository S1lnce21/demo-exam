const sequelize = require('./db');
const { Category, User, Product, Order } = require('./models');
const mockData = require('../demo-shop-react/src/data/mockData.json');

const variant = mockData.variantA;

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно.');
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Таблицы пересозданы.');

    const categoriesMap = {};
    for (const cat of variant.categories) {
      const createdCat = await Category.create({ name: cat.name });
      categoriesMap[cat.id] = createdCat.id;
    }

    const usersMap = {};
    for (const u of variant.users) {
      const createdUser = await User.create({
        login: u.login,
        fullName: u.full_name,
        role: u.role_code,
      });
      usersMap[u.id] = createdUser.id;
    }

    for (const p of variant.products) {
      let totalStock = 0;
      for (const v of p.variants) {
        totalStock += v.quantity;
      }

      await Product.create({
        name: p.manufacturer_name + ' | ' + p.name,
        description: p.description,
        price: p.base_price,
        stock: totalStock,
        image: p.image || null,
        categoryId: categoriesMap[p.category_id],
      });
    }

    for (const o of variant.orders) {
      for (const item of o.items) {
        await Order.create({
          userId: usersMap[o.user_id],
          productId: item.product_id,
          quantity: item.quantity,
          totalPrice: item.unit_price * item.quantity,
          status: 'new',
          createdAt: new Date(o.order_date),
        });
      }
    }

    console.log('База данных успешно заполнена!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы:', error);
    process.exit(1);
  }
}

seedDatabase();