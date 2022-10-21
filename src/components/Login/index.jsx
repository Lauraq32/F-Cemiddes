import { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Toast } from "primereact/toast";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      const response = await axios.post(url, data);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Creado Exitosamente",
          life: 3000,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.user.uid);
        localStorage.setItem("role", response.data.user.role);
        var now = new Date().getTime();
        localStorage.setItem("setupTime", now);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Oops! usuario incorrecto",
        life: 5000,
      });
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <Toast ref={toast} />
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <img
              src={"assets/layout/images/logo.jpg"}
              alt="logo"
              className={styles.login_logo}
            />

            <input
              type="email"
              placeholder="Correo Electronico"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Contraseña"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Ingresar
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>Cemiddes</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
