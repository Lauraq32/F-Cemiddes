import { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const statusOptions = [
    {id: 1, role: 'ADMIN', status: 'ADMIN'},
    {id: 2, role: 'NOADMIN', status: 'NOADMIN'}
  ]

  const [status, setStatus] = useState()

  const updateStatus = (e) => {
    setStatus(e.value)
    setData({...data, role: e.value.role})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(localStorage.getItem("role") === "ADMIN"){
     
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/auth/signup`;
  
        const response = await axios.post(url, data);
  
        if (response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Exito",
            detail: "Creado Exitosamente",
            life: 5000,
          });
          setData(response.data);
        }
  
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Oops! no tienes los permisos necesarios",
        life: 5000,
      });
    }
    
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <Toast ref={toast} />
          <img src={'assets/layout/images/logo.jpg'} alt="logo" className={styles.login_logo}/>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Crear Cuenta</h1>
            <input
              type="text"
              placeholder="Nombre"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Apellido"
              name="lastname"
              onChange={handleChange}
              value={data.lastname}
              required
              className={styles.input}
            />
            <div className="field">
           {/* <label htmlFor="role">role</label> */}
            <Dropdown
              id="role"
              optionLabel="role"
              value={status}
              options={statusOptions}
              onChange={updateStatus}
              placeholder="Rol"
              className={styles.input}
              />
          </div>
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
              Registrate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
