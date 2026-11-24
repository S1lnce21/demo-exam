import { useState } from "react";

export default function LoginPage({ onLogin, onBack }) {
  const [login, setLogin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(login);
  };

  return (
    <div className="panel login-box">
      <div className="page-bar">
        <h1>Авторизация</h1>
        <button className="btn" onClick={onBack}>← Назад</button>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Логин:</label>
        <input 
          className="input" 
          value={login} 
          onChange={(e) => setLogin(e.target.value)} 
          placeholder="client1, manager1, admin1" 
        />
        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
          Войти
        </button>
      </form>
    </div>
  );
}