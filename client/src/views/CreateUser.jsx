import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from './Footer.jsx'; 
import NavigationBar from './Navigations/NavigationSignup.jsx'; 
import logo from '../Images/Logo.png'; 
import bgsignin from '../Images/signinbackgroundpattern.png'
import signupimage from '../Images/signupimage.jpg'

const create = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3001/createUser";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
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
		<div className="bg-custom-dark  min-h-screen">
			<NavigationBar logo={logo} /> 
			<div className="flex justify-center items-center bg-custom-dark min-h-screen mt-10 mb-40 ">
				<div className="flex max-w-4xl shadow-lg border-2 border-custom-light  ">
				<div
					className="relative bg-white w-[30rem] flex flex-col justify-center items-center"
					style={{ 
						backgroundImage: `url(${bgsignin})`, 
						backgroundSize: 'cover', 
						backgroundPosition: 'center' 
					}}
					>
					{}
				</div>


				<div className="bg-custom-gray pt-20 pl-16 pr-16 pb-20 flex flex-col justify-center items-center w-[30rem] border-1 border-white ">

						<form className="w-full" onSubmit={handleSubmit}>
							<h1 className="text-white mb-10 text-center font-spartan font-thin text-4xl">
								Sign Up to LunuMirisa
							</h1>
							<div className="flex text-white pt-4 font-spartan items-start font-thin">First Name</div>
							<input
								type="text"
								placeholder=""
								name="firstName"
								onChange={handleChange}
								value={data.firstName}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
							/>

							<div className="flex text-white font-spartan items-start font-thin">Last Name</div>
							<input
								type="text"
								placeholder=""
								name="lastName"
								onChange={handleChange}
								value={data.lastName}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
							/>

							<div className="flex text-white font-spartan items-start font-thin">E-mail</div>
							<input
								type="email"
								placeholder=""
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
							/>

							<div className="flex text-white font-spartan items-start font-thin">Password</div>
							<input
								type="password"
								placeholder=""
								name="password"
								onChange={handleChange}
								value={data.password}
								required
								className="w-full p-2 mb-7 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
							/>
							{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
							<div class="flex justify-center">
							<button
								type="submit"
								class="bg-white border border-[#1A1A1A] rounded-[0.9375em] box-border text-black cursor-pointer inline-block font-sans font-semibold text-[16px] m-0 min-h-[3em] min-w-0 outline-none py-[0.5em] px-[1.5em] text-center no-underline transition-all duration-[300ms] ease-[cubic-bezier(.23,1,.32,1)] select-none touch-manipulation will-change-transform hover:bg-custom-cyan hover:text-black hover:shadow-[rgba(0,0,0,0.25)_0_8px_15px] hover:translate-y-[-2px] active:shadow-none active:translate-y-0 disabled:pointer-events-none"
							>
								Sign Up
								<span>
								<span>
									<span></span>
								</span>
								</span>
							</button>
							</div>
						</form>

						<div className="flex text-white pt-4 font-spartan items-start">
							<div className="font-thin"> 
								Already has an account&nbsp;&nbsp; 
							</div> 
								<Link to="/login">
									<button className="font-bold hover:underline">
										Sign In
									</button>
								</Link>
						</div>
					</div>
				</div>
			</div>
			<Footer/> 
		</div>

	);
};

export default create;
