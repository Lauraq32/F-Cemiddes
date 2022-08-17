import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth/login";
			const res = await axios.post(url, data);
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("uid", res.data.user.uid);
			localStorage.setItem("role", res.data.user.rol);
			var now = new Date().getTime();
			localStorage.setItem('setupTime', now)
			//console.log(res.data);
			navigate("/dashboard");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<img src={'assets/layout/images/logo.jpg'} alt="logo" className={styles.login_logo}/>

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
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Registrate
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
