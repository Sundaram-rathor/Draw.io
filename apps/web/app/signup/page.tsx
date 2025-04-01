'use client'
import { BACKEND_URL } from '@repo/backend-common/config';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const router = useRouter()

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  };

  const formBoxStyle: React.CSSProperties = {
    background: 'white',
    padding: '2rem',
    width: '350px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
  };

  const inputFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
    backgroundColor:'white',
    color:'black'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginTop:'30px'
  };


  const hitSignup = async ()=>{

    try {
      const response = await axios.post(`${BACKEND_URL}/signup`,{
      
        email,
        password
      
      })

      if(response.data.success ==true){
        alert('user signed up sucess')
        router.push('/signin')
      }else{
        alert('user not signed up')
      }

    } catch (error) {
      console.log('error in signing up', error)
    }
    

    

    
  }

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h2 style={titleStyle}>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          style={inputFieldStyle}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={inputFieldStyle}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={buttonStyle} onClick={hitSignup}>Sign Up</button>
      </div>
    </div>
  );
};

export default Page;
