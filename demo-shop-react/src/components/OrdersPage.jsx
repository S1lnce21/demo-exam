export default function OrdersPage({ orders, onDelete, onBack }) {
  return (
    <div className="panel">
      <div className="page-bar">
        <h1>Заказы</h1>
        <button className="btn" onClick={onBack}>← Назад</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Дата</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            let total = 0;
            for (let i = 0; i < o.items.length; i++) {
              total += o.items[i].quantity * o.items[i].unit_price;
            }
            return (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.order_date}</td>
                <td>{o.client_full_name}</td>
                <td>{total} ₽</td>
                <td>
                  <button className="btn btn-danger" onClick={() => onDelete(o.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}