import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<div className="flex w-3/4 max-w-4xl shadow-lg">
				<div className="w-1/2 bg-white p-8 flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
					<Link to="/login">
						<button
							type="button"
							className="px-6 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
						>
							Sign in
						</button>
					</Link>
				</div>
				<div className="w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center">
					<form className="w-full" onSubmit={handleSubmit}>
						<h1 className="text-3xl font-bold mb-4 text-center">
							Create Account
						</h1>
						<input
							type="text"
							placeholder="First Name"
							name="firstName"
							onChange={handleChange}
							value={data.firstName}
							required
							className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
						/>
						<input
							type="text"
							placeholder="Last Name"
							name="lastName"
							onChange={handleChange}
							value={data.lastName}
							required
							className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
						/>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
						/>
						{error && <div className="text-red-500 text-sm mb-4">{error}</div>}
						<button
							type="submit"
							className="w-full p-2 text-white bg-green-500 rounded-md hover:bg-green-600"
						>
							Sign Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default create;
