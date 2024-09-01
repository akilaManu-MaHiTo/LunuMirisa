import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from './Footer.jsx'; 
import NavigationBar from './Components/NavigationSignup.jsx'; 
import logo from '../Images/Logo.png'; 
import signinBG from '../Images/signinBG.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Create = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "", // Temporarily keep this for client-side validation
	});
	const [error, setError] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Client-side validation for password confirmation
		if (data.password !== data.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		console.log("Data being sent:", {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password
		}); // Log data being sent to server

		try {
			const url = "http://localhost:3001/createUser";
			const response = await axios.post(url, {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password
			});
			console.log("Response from server:", response.data); // Log server response
			navigate("/login");
		} catch (error) {
			console.error("Error occurred during sign-up:", error); // Log the error
			if (error.response) {
				console.error("Error response data:", error.response.data); // Log response data
				setError(error.response.data.message || "An error occurred during sign-up.");
			} else {
				setError("An unexpected error occurred.");
			}
		}
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const toggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisible(!confirmPasswordVisible);
	};

	return (
		<div className="bg-custom-dark min-h-screen">
			<NavigationBar logo={logo} /> 
			<div className="flex justify-center items-center bg-custom-dark min-h-screen mt-10 mb-40">
				<div className="flex w-[75rem] shadow-lg border-2 border-custom-light">
					<div
						className='hidden sm:block w-8/12 relative'
						style={{ 
							backgroundImage: `url(${signinBG})`, 
							backgroundSize: 'cover', 
							backgroundPosition: 'center' 
						}}
					>
						<div className='absolute inset-0 bg-black opacity-70'></div>
						<div className='relative flex justify-center items-center h-full'>
							<h2 className='text-white font-spartan font-thin text-5xl text-center px-20'>
								Craving something exciting? Sign up now and dive in!
							</h2>
						</div>
					</div>

					<div className="bg-white pt-20 pl-16 pr-16 pb-20 flex flex-col justify-center items-center w-1/2 border-1 border-white">
						<form className="w-full" onSubmit={handleSubmit}>
							<h1 className="text-center text-black font-spartan font-semibold text-[4rem] mb-10">
								Sign Up 
							</h1>
							<div className="flex text-black pt-4 font-spartan items-start">First Name</div>
							<input
								type="text"
								placeholder=""
								name="firstName"
								onChange={handleChange}
								value={data.firstName}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none transition-colors duration-300 hover:border-black"
							/>

							<div className="flex text-black font-spartan items-start">Last Name</div>
							<input
								type="text"
								placeholder=""
								name="lastName"
								onChange={handleChange}
								value={data.lastName}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none transition-colors duration-300 hover:border-black"
							/>

							<div className="flex text-black font-spartan items-start">E-mail</div>
							<input
								type="email"
								placeholder=""
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className="w-full p-2 mb-5 border border-gray-300 rounded-md focus:outline-none transition-colors duration-300 hover:border-black"
							/>

							<div className="flex text-black font-spartan items-start">Password</div>
							<div className="relative">
								<input
									type={passwordVisible ? "text" : "password"}
									placeholder=""
									name="password"
									onChange={handleChange}
									value={data.password}
									required
									className="w-full p-2 mb-7 border border-gray-300 rounded-md focus:outline-none transition-colors duration-300 hover:border-black"
								/>
								<span 
									className="absolute right-3 top-1/2 transform -translate-y-6 ml-2 cursor-pointer"
									onClick={togglePasswordVisibility}
								>
									<FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
								</span>
							</div>

							<div className="flex text-black font-spartan items-start">Confirm Password</div>
							<div className="relative">
								<input
									type={confirmPasswordVisible ? "text" : "password"}
									placeholder=""
									name="confirmPassword"
									onChange={handleChange}
									value={data.confirmPassword}
									required
									className="w-full p-2 mb-7 border border-gray-300 rounded-md focus:outline-none transition-colors duration-300 hover:border-black"
								/>
							</div>

							{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
							<div className="flex justify-center">
								<button
									type="submit" // Ensure button type is submit
									className="w-64 mt-5 py-2 px-4 bg-black text-white rounded-md shadow-sm duration-300 hover:bg-white hover:border hover:border-black hover:text-black hover:scale-105"
								>
									Sign Up
								</button>
							</div>
						</form>

						<div className="flex text-black pt-4 font-spartan items-start">
							<div className="font-thin"> 
								Already have an account?&nbsp;&nbsp; 
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

export default Create;
