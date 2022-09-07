import React, {useState, useEffect, useRef} from 'react';
import {InputText} from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import axios from 'axios';
import headers from '../service/token';


const Profile = () => {
    let emptyUser = {
        uid: null,
        name: '',
        lastname: '',
        rol: '',
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
        
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/` + userID, {headers})
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

        if (user.uid) {
            axios.put(`${process.env.REACT_APP_API_URL}/api/users/` + _user.uid, _user , {headers}, )
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Actualizado Exitosamente', life: 3000 });
                getUser();

            })
            .catch(error => console.error('Error while updating password:',error));
        }

    }



    return (
        <div className="grid justify-content-center">
            <Toast ref={toast} />

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Actualizar Perfil</h5>
                    <div className="field">
                        <label htmlFor="name">First Name</label>
                        <InputText id="nombre" type="text" value={user.name} onChange={(e) => onInputChange(e, 'name')}   />
                    </div>

                    <div className="field">
                        <label htmlFor="lastname">Last Name</label>
                        <InputText id="lastname" type="text" value={user.lastname}  onChange={(e) => onInputChange(e, 'lastname')} />
                    </div>

                    <div className="field">
                        <label htmlFor="rol">Role</label>
                        <InputText id="rol" type="text" value={user.rol}  onChange={(e) => onInputChange(e, 'rol')} />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="text" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Change Password</label>
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