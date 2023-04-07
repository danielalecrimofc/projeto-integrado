import { useRef } from "react";
import "./LayoutHome.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logo_servmais_app from "../assets/logo_servmais_app.png";
export const LayoutHome = (props) =>{
	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

	return (
		<header>
			<h3>Serv+</h3>
      <span className="logo-edit">
        <img src={logo_servmais_app} alt="Service Mais" />
      </span>
			<nav ref={navRef}>
				<a href="/#">Home</a>
				<a href="/#">Login</a>
				<a href="/#">Register</a>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
      {props.children}
		</header>
	);
}

export default LayoutHome;