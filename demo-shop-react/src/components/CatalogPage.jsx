import { useState } from "react";
import { getProductData } from "../utils/catalogLogic.js";
import ProductCard from "./ProductCard.jsx";

export default function CatalogPage({ products, orders, categories, user, onSelectProduct }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  const formattedProducts = products.map((product) => {
    return getProductData(product, categories, orders);
  });

  const visibleProducts = formattedProducts.filter((p) => {
    if (category !== "all" && String(p.category_id) !== category) {
      return false;
    }
    if (search !== "") {
      const query = search.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(query);
      const descMatch = p.description.toLowerCase().includes(query);
      if (!nameMatch && !descMatch) {
        return false;
      }
    }
    return true;
  });

  if (sort === "asc") {
    visibleProducts.sort((a, b) => a.finalPrice - b.finalPrice);
  }
  if (sort === "desc") {
    visibleProducts.sort((a, b) => b.finalPrice - a.finalPrice);
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Каталог обуви</h1>

      {user && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            style={{ flex: 1, padding: "8px" }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={{ padding: "8px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            style={{ padding: "8px" }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Без сортировки</option>
            <option value="asc">Цена: по возрастанию</option>
            <option value="desc">Цена: по убыванию</option>
          </select>
        </div>
      )}

      <div>
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
}