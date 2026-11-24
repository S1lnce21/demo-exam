export default function Header({ user, companyName, onNavigate, onLogout }) {
  const isManager = user && (user.role_code === "manager" || user.role_code === "admin");

  return (
    <header className="app-header">
      <div className="brand" onClick={() => onNavigate("catalog")}>
        <img src="/logo.png" alt="Логотип" />
        <div>
          <div className="brand-title">{companyName}</div>
          <div className="brand-subtitle">Система оформления заказов</div>
        </div>
      </div>

      <div className="header-actions">
        {isManager && (
          <button className="btn" onClick={() => onNavigate("orders")}>
            Заказы
          </button>
        )}
        
        {user ? (
          <>
            <div className="user-badge">
              <div className="user-fio">{user.full_name}</div>
              <div className="user-role">{user.role_name}</div>
            </div>
            <button className="btn" onClick={onLogout}>Выйти</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => onNavigate("login")}>
            Войти
          </button>
        )}
      </div>
    </header>
  );
}