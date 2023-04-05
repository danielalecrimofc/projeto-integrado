import { useRef } from "react";
import "./LayoutHome.css";
import { FaBars, FaTimes } from "react-icons/fa";
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