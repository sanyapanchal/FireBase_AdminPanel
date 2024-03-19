// SignUpForm.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, firestore } from '../firebase'; // Make sure to update the path
import LoginForm from './LoginForm';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpForm = () => {
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

  const onSubmit = async (data) => {
    try {
      let userCredential;
      if (data.provider === 'google') {
        const provider = new GoogleAuthProvider();
        userCredential = await signInWithPopup(auth, provider);
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      }

      // const user = userCredential.user;

      // await firestore.collection('users').doc(user.uid).set({
      //   username: data.username,
      //   email: user.email,
      // });

      console.log('User signed up successfully!');
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-5 rounded shadow-sm">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary">
            Sign Up with Email/Password
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ provider: 'google' })}
            className="btn btn-danger ms-2"
          >
            Sign Up with Google
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
