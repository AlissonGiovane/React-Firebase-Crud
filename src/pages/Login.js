import React, { useState } from 'react'
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'semantic-ui-react';

const Login = () => {

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      <h1>Página de login</h1>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Input
          type="email"
          placeholder="Seu email"
          required
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Sua senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className='login-button'>Login</Button>
      </Form>
      <p>Não tem uma conta? <Link to="/signup">Crie uma</Link></p>
    </div>
  )
}

export default Login