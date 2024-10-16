import logo from './logo.svg';
import './App.css';
import React from 'react';
import {View} from 'react-native';

function App() {
  return (
    <div className="App">
      
      <h1>Welcome to Outsiders Football Club for Folsom and San Quentin!</h1>

      <div class="site-header">

        <button class="rounded-button">HOME</button>
        <button class="rounded-button">REGISTRATION</button>
        <button class="rounded-button">SCHEDULING</button>
        <div class="dropdown">
          <button class="rounded-button dropdown-button">ACCOUNT</button>
          <div class="dropdown-content">
            <a href="">Login</a>
            <a href="">Sign in</a>
          </div>
        </div>
      </div>

    </div>

    
  );
}

export default App;
