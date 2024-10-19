import logo from './logo.svg';
import './App.css';
import React from 'react';
import {View} from 'react-native';

function App() {
  return (
    <div className="App">
      <img src="https://cdn.discordapp.com/attachments/1277835451709001748/1295613457638621184/outsiders4.png?ex=67148f8f&is=67133e0f&hm=0b35e213d338ce801d28499ba12804066b94bcea74d9a7194e1013e2a4c65db6&" alt="Logo"></img>
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
