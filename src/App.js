/* eslint-disable no-unused-vars */
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";

import Products from "./components/pages/Products";
import Doctors from "./components/pages/Doctors";
import Reservations from './components/pages/Reservations';
import Clients from "./components/pages/Clients";
import Profile from "./components/pages/Profile";
import Dashboard from "./components/pages/Dashboard";
import Treatments from "./components/pages/Treatments";
import Cuotas from "./components/pages/Cuotas";
import EarningsPage from "./components/pages/Earnings";




import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';


import { AppTopbar } from './components/AppTopbar';
import { AppMenu } from './components/AppMenu';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './components/assets/layout/layout.scss';


function App() {
    let navigate = useNavigate();
    var isAuth = false;

    if(localStorage.getItem("token") === null){
         isAuth=  true;
    }

	const [layoutMode] = useState('static');
    const [layoutColorMode] = useState('light')
    const [inputStyle] = useState('outlined');
    const [ripple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        event.preventDefault();
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        event.preventDefault();
        setMobileTopbarMenuActive((prevState) => !prevState);
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Inicio', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Comision', icon: 'pi pi-fw pi-user-edit', to: '/doctors' },
                { label: 'Reservaciones', icon: 'pi pi-fw pi-id-card', to: '/reservations' },
                { label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/Clients' },
                { label: 'Productos', icon: 'pi pi-fw pi-shopping-cart', to: '/products' },
                { label: 'Tratamientos', icon: 'pi pi-fw pi-plus-circle', to: '/treatment' },
                { label: 'Cuotas', icon: 'pi pi-fw pi-user-plus', to: '/cuotas' },
                { label: 'Ganancias', icon: 'pi pi-fw pi-money-bill', to: '/earnings' },
            ]
        }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });


    /* Deleting token after 1 hour */
    var hours = 24; // to clear the localStorage after 1 hour
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');

    if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.clear()
        localStorage.setItem('setupTime', now);
        window.location.href = "/login"; 
    }

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            {isAuth ?
			<Routes>
                        
						<Route path="/*" element={<Login />} />
				 		<Route path="/signup" element={<Signup />} />
				 		<Route path="/login" element={<Login />} />
			</Routes>  
            :
			 <div>
				<Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

				<AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
					mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

				
					<div className="layout-sidebar" onClick={onSidebarClick}>
						<AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
					</div>

					
				<div className="layout-main-container">
					<div className="layout-main">
					<Routes>
							<Route path="/*" element={<Dashboard />} />
							<Route path="/doctors" element={<Doctors />} />
							<Route path="/products" element={<Products />} />
							<Route path="/reservations" element={<Reservations />} />
							<Route path="/clients" element={<Clients />} />
							<Route path="/profile" element={<Profile />} />
							<Route path="/treatment" element={<Treatments />} />
	
							<Route path="/cuotas" element={<Cuotas />} />
							<Route path="/earnings" element={<EarningsPage />} />
						</Routes>
					</div>

				</div>
			</div> }
        </div>

                        
		

    );
}

export default App;