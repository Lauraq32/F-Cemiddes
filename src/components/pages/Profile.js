import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import axios from "axios";
import { getHeaders } from "../service/token";
import { Dropdown } from "primereact/dropdown";

const Profile = () => {
  let emptyUser = {
    _id: null,
    name: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState(emptyUser);
  const toast = useRef(null);

  const userID = localStorage.getItem("uid");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/` + userID, {
        headers: getHeaders(),
      })
      .then((response) => {
        const userData = response.data;
        setUser(userData);
      })
      .catch((error) => console.error("Error while getting user", error));
  };

  const statusOptions = [
    {id: 1, role: 'ADMIN', status: 'ADMIN'},
    {id: 2, role: 'NOADMIN', status: 'NOADMIN'}
  ]


  const [status, setStatus] = useState()

  const updateStatus = (e) => {
    setStatus(e.value)
    setUser({...user, role: e.value.role})
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  };

  const saveUser = () => {
    let _user = { ...user };

    if (userID) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/api/users/` + userID, _user, {
          headers: getHeaders(),
        })
        .then((response) => {
          toast.current.show({
            severity: "success",
            summary: "Exito",
            detail: "Actualizado Exitosamente",
            life: 3000,
          });
          getUser();
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Oops! Algo salio mal",
            life: 5000,
          });
          getUser();
        });
    }
  };

  return (
    <div className="grid justify-content-center">
      <Toast ref={toast} />

      <div className="col-12 md:col-6">
        <div className="card p-fluid">
          <h5>Actualizar Perfil</h5>
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <InputText
              id="nombre"
              type="text"
              value={user.name}
              onChange={(e) => onInputChange(e, "name")}
              disabled/>
          </div>

          <div className="field">
            <label htmlFor="lastname">Apellido</label>
            <InputText
              id="lastname"
              type="text"
              value={user.lastname}
              onChange={(e) => onInputChange(e, "lastname")}
              disabled/>
          </div>

          <div className="field">
            <label htmlFor="role">role</label>
            <Dropdown
              id="role"
              optionLabel="role"
              value={status}
              options={statusOptions}
              onChange={updateStatus}
              placeholder="Seleccionar"
              disabled/>
          </div>

          <div className="field">
            <label htmlFor="email">Correo Electronico</label>
            <InputText
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => onInputChange(e, "email")}
              disabled/>
          </div>

          <div className="field">
            <label htmlFor="password">Cambiar contraseña</label>
            <InputText
              id="password"
              type="password"
              placeholder="New Password"
              onChange={(e) => onInputChange(e, "password")}
            />
          </div>
          <Button
            label="Actualizar"
            icon="pi pi-check"
            className="p-button-text password-btn"
            onClick={saveUser}
          />
        </div>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location?.pathname === nextProps.location?.pathname;
};

export default React.memo(Profile, comparisonFn);
