import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import Dashboard from './Dashboard'; 
import { signInWithEmailAndPassword } from 'firebase/auth';


const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (email , password) => {
    try {
      // Check if the user is already logged in
      console.log("errorrr");
      if (!loggedIn) {
        console.log("err",email,password);
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // Additional logic
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // Handle errors
          console.log("error" , errorMessage);
        });
      }
      setLoggedIn(true); 
      console.log('User signed in successfully!');
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loggedIn) {
    return <Dashboard />; 
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-5 rounded shadow-sm">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="mt-3 text-center">Don't have an account? <a href="/">Sign Up</a></p>
      </div>
    </div>
  );
};

export default LoginForm;
