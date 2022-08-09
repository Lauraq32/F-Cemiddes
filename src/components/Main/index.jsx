/* eslint-disable jsx-a11y/alt-text */
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Main = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};
	useEffect(() => {
		if (!token){
			navigate("/login");
		}
	}, [navigate, token]);
	
	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Cemiddes</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Cerrar Session
				</button>
			</nav>
			<div className={styles.login_container}>
				<div className={styles.sidebar}></div>
			</div>
		</div>
	);
};

export default Main;
