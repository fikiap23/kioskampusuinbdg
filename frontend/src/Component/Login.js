import React, { useState } from 'react';
import image from '../assets/image-masuk.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    fetch('http://localhost:5000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        setUser(data.user);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/home');
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row w-screen h-screen">
      <img src={image} className="w-full md:w-1/2 lg:w-1/2 h-1/3 md:h-screen object-cover" alt="Login Illustration" />
      <div className="py-6 w-full md:w-1/2 flex flex-col justify-center items-center h-full">
        <h1 className="text-center mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold">Welcome Back!</h1>
        <p className='text-sm mb-3'>Enter your email and password to continue</p>
        <div className="flex bg-[#EAECEB] w-fit rounded-xl p-1 mb-5">
          <div className="bg-white p-2 cursor-pointer rounded-l-xl w-25 text-center">
            Sign In
          </div>
          <Link to={"/regis"}>
            <div className="p-2 cursor-pointer rounded-r-xl w-25 text-center hover:bg-white">
              Sign Up
            </div>
          </Link>
        </div>
        <div className="flex flex-col md:w-1/2 lg:w-2/5 mb-3 gap-4">
          <div>
            <p>Email</p>
            <input
              className="hover:border-green-400 px-2 text-xs w-full h-10 border border-slate-400 rounded-md"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <p>Password</p>
            <input
              type="password"
              className="hover:border-green-400 px-2 text-sm w-full h-10 border border-slate-400 rounded-md"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="my-4 w-full bg-green-800 hover:bg-green-600 text-white rounded-lg px-5 py-1 font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
      {showAlert && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          Login successful!
        </div>
      )}
    </div>
  );
};

export default Login;