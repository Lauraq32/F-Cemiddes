import React  from 'react';
import { Link } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

const nestedMenuitems = [
    {
        label: '',
        icon: 'pi pi-fw pi-user',
        items: [
            {
                label: 'Perfil',
                icon: 'pi pi-fw pi-cog',
                command: () => { window.location.href = "/profile"; }
            },
            {
                label: 'Cerrar sesión',
                command: () => { 
                    localStorage.removeItem("token");
                    localStorage.removeItem("uid");
                    localStorage.removeItem("setupTime");
                    window.location.href = "/login"; 
                }

            }
        ]
    },
];

export const AppTopbar = (props) => {

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={'assets/layout/images/logo.jpg'} alt="logo"/>
                <span></span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <Menubar model={nestedMenuitems} className="layout-topbar-menu lg:flex origin-top mr-8"></Menubar>

        
        </div>
    );
}
