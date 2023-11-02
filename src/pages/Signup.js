import React, { useState } from 'react'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'semantic-ui-react';

const Signup = () => {

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Página de registro</h1>
      <Form onSubmit={handleSubmit} className='signup-form'>
        <Input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Your Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className='signup-button'>Signup</Button>
      </Form>
      <p>Já tem uma conte? <Link to="/login">Logue-se</Link></p>
    </div>
  )
}

export default Signup