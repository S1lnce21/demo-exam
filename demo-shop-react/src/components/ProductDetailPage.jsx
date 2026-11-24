import { useState } from "react";

export default function ProductDetailPage({ product, user, onAdd, onBack }) {
  const [variantId, setVariantId] = useState(null);
  const [qty, setQty] = useState("1");
  const [err, setErr] = useState("");

  const currentVariant = product.variants.find((v) => v.id === variantId);

  const handleQtyChange = (e) => {
    const val = e.target.value;
    if (val !== "" && !/^\d+$/.test(val)) {
      setErr("Только цифры");
      return;
    }
    if (currentVariant && Number(val) > currentVariant.quantity) {
      setErr("Больше остатка");
      return;
    }
    setErr("");
    setQty(val);
  };

  const handleAdd = () => {
    if (!variantId) {
      setErr("Выберите размер");
      return;
    }
    const numQty = Number(qty);
    if (numQty <= 0) {
      setErr("Количество > 0");
      return;
    }

    onAdd({
      product_id: product.id,
      variant_id: currentVariant.id,
      product_name: product.name,
      manufacturer_name: product.manufacturer_name,
      size: currentVariant.size,
      quantity: numQty,
      unit_price: product.finalPrice,
    });
    setVariantId(null);
    setQty("1");
    setErr("");
  };

  return (
    <div className="panel">
      <div className="page-bar">
        <h1>Карточка товара</h1>
        <button className="btn" onClick={onBack}>← Назад</button>
      </div>

      <div className="detail-grid">
        <div>
          <img 
            className="detail-image" 
            src={product.image || "/picture.png"} 
            alt={product.name} 
            onError={(e) => { e.target.onerror = null; e.target.src = "/picture.png"; }}
          />
        </div>
        <div>
          <h2>{product.manufacturer_name} | {product.name}</h2>
          <p>Категория: {product.categoryName}</p>
          <p>Состав: {product.composition}</p>
          <p>Описание: {product.description}</p>
          <div style={{ margin: "15px 0" }}>
            {product.discount > 0 && <span style={{ textDecoration: "line-through", marginRight: "10px" }}>{product.base_price} ₽</span>}
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>{product.finalPrice} ₽</span>
          </div>

          <div className="size-buttons">
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={`size-btn ${variantId === v.id ? "active" : ""}`}
                disabled={v.quantity === 0}
                onClick={() => { setVariantId(v.id); setErr(""); }}
              >
                {v.size} ({v.quantity})
              </button>
            ))}
          </div>

          <div style={{ margin: "15px 0" }}>
            <label>Кол-во: </label>
            <input className="input" style={{ width: "80px" }} value={qty} onChange={handleQtyChange} />
          </div>

          {err && <p style={{ color: "red" }}>{err}</p>}

          <button className="btn btn-primary" onClick={handleAdd} disabled={!user}>
            {user ? "Добавить в заказ" : "Войдите"}
          </button>
        </div>
      </div>
    </div>
  );
}