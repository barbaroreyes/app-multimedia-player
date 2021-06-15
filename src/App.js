import React from 'react'
import Amplyfy from 'aws-amplify';
import awsconfig from "./aws-exports";
import {AmplifySignOut,withAuthenticator} from '@aws-amplify/ui-react'
import './App.css';
Amplyfy.configure(awsconfig)
function App() {
  return (
    <div className="App">
      <header className="App-header">
       <AmplifySignOut/>
       <h2>My app Content</h2>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
