import React, {useState, useEffect, useRef} from 'react';
import {InputText} from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import axios from 'axios';
import headers, { getHeaders } from '../service/token';


const Profile = () => {
    let emptyUser = {
        _id: null,
        name: '',
        lastname: '',
        role: '',
        email: '',
        password: ''
    };
    
    const [user, setUser] = useState(emptyUser);
    const toast = useRef(null);


    const userID = localStorage.getItem('uid');
    
    useEffect(() => {
        getUser();
    }, []);
    
    const getUser = () => {
        
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/` + userID, {headers: getHeaders()})
        .then((response) => {
            const userData = response.data;
            setUser(userData);
        })
        .catch(error => console.error('Error while getting user',error));

    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    }

    const saveUser = () => {
        let _user = {...user}

        if (user._id) {
            axios.put(`${process.env.REACT_APP_API_URL}/api/users/` + _user._id, _user , {headers: getHeaders()}, )
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Actualizado Exitosamente', life: 3000 });
                getUser();

            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Oops! Algo salio mal', life: 5000 });
                getUser();
            });
        }

    }



    return (
        <div className="grid justify-content-center">
            <Toast ref={toast} />

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Actualizar Perfil</h5>
                    <div className="field">
                        <label htmlFor="name">Nombre</label>
                        <InputText id="nombre" type="text" value={user.name} onChange={(e) => onInputChange(e, 'name')}   />
                    </div>

                    <div className="field">
                        <label htmlFor="lastname">Aoellido</label>
                        <InputText id="lastname" type="text" value={user.lastname}  onChange={(e) => onInputChange(e, 'lastname')} />
                    </div>

                    <div className="field">
                        <label htmlFor="rol">Rol</label>
                        <InputText id="rol" type="text" value={user.role}  onChange={(e) => onInputChange(e, 'role')} />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Correo Electronico</label>
                        <InputText id="email" type="text" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Cambiar contraseña</label>
                        <InputText id="password" type="password" placeholder='New Password' onChange={(e) => onInputChange(e, 'password')} />
  
                    </div>
                    <Button label="Actualizar" icon="pi pi-check" className="p-button-text password-btn" onClick={saveUser} />
                </div>
            </div> 
        </div>       
        );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Profile, comparisonFn);