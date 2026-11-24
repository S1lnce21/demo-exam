import { useState, useEffect } from "react";
import rawData from "./data/mockData.json";
import { getProductData } from "./utils/catalogLogic.js";
import Header from "./components/Header.jsx";
import LoginPage from "./components/LoginPage.jsx";
import CatalogPage from "./components/CatalogPage.jsx";
import ProductDetailPage from "./components/ProductDetailPage.jsx";
import OrdersPage from "./components/OrdersPage.jsx";

const data = rawData.variantA;
const STORAGE_KEY = "shop_data";

export default function App() {
  const [screen, setScreen] = useState("catalog");
  const [user, setUser] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  
  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return { products: data.products, orders: data.orders };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    if (screen === "catalog") document.title = "Каталог";
    if (screen === "login") document.title = "Вход";
    if (screen === "detail") document.title = "Товар";
    if (screen === "orders") document.title = "Заказы";
  }, [screen]);

  const handleLogin = (loginValue) => {
    let found = null;
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].login === loginValue.trim()) {
        found = data.users[i];
      }
    }
    if (found) {
      setUser(found);
      setScreen("catalog");
    } else {
      alert("Неверный логин");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("catalog");
  };

  const handleAddToOrder = (item) => {
    const newOrder = {
      id: Date.now(),
      user_id: user.id,
      client_full_name: user.full_name,
      order_date: new Date().toISOString().slice(0, 10),
      items: [{ ...item, id: Date.now() }],
    };

    setAppData((prev) => {
      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
      };
    });
    setScreen("catalog");
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Удалить заказ?")) {
      setAppData((prev) => {
        return {
          ...prev,
          orders: prev.orders.filter((o) => o.id !== id),
        };
      });
    }
  };

  let currentProduct = null;
  if (selectedId) {
    const rawProduct = appData.products.find((p) => p.id === selectedId);
    if (rawProduct) {
      currentProduct = getProductData(rawProduct, data.categories, appData.orders);
    }
  }

  return (
    <div>
      <Header 
        user={user} 
        companyName={data.companyName} 
        onNavigate={setScreen} 
        onLogout={handleLogout} 
      />

      <main className="container">
        {screen === "catalog" && (
          <CatalogPage
            products={appData.products}
            orders={appData.orders}
            categories={data.categories}
            user={user}
            onSelectProduct={(id) => {
              setSelectedId(id);
              setScreen("detail");
            }}
          />
        )}

        {screen === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onBack={() => setScreen("catalog")}
          />
        )}

        {screen === "detail" && currentProduct && (
          <ProductDetailPage
            product={currentProduct}
            user={user}
            onAdd={handleAddToOrder}
            onBack={() => setScreen("catalog")}
          />
        )}

        {screen === "orders" && user && (user.role_code === "manager" || user.role_code === "admin") && (
          <OrdersPage
            orders={appData.orders}
            user={user}
            onDelete={handleDeleteOrder}
            onBack={() => setScreen("catalog")}
          />
        )}
      </main>
    </div>
  );
}