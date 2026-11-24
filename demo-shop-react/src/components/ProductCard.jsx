export default function ProductCard({ product, onSelect }) {
  let imgSrc = "/picture.png";
  if (product.image) {
    imgSrc = product.image;
  }

  let cardClass = "product-card";
  if (product.isLow) {
    cardClass = "product-card low-stock";
  }

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = "/picture.png";
  };

  return (
    <div className={cardClass} onClick={() => onSelect(product.id)}>
      <img 
        className="product-thumb" 
        src={imgSrc} 
        alt={product.name} 
        onError={handleImgError} 
      />
      
      <div>
        <h3 className="product-title">
          {product.manufacturer_name} | {product.name}
        </h3>
        <div className="product-meta">
          <span>Категория: {product.categoryName}</span>
          <span>Количество: {product.totalQty > 5 ? "много" : "мало"} (всего {product.totalQty})</span>
          <span>Состав: {product.composition}</span>
        </div>
      </div>
      
      <div className="product-price-col">
        {product.discount > 0 && (
          <span className="price-old">{product.base_price} ₽</span>
        )}
        <span className="price-current">{product.finalPrice} ₽</span>
      </div>
    </div>
  );
}