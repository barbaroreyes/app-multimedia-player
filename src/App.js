import React ,{useState,useEffect}from 'react'
import Amplyfy, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from "./aws-exports";
import {AmplifySignOut,withAuthenticator} from '@aws-amplify/ui-react'
import {listMedias} from './graphql/queries'
import './App.css';
Amplyfy.configure(awsconfig)
function App() {
  const [media,setMedia] =useState([])
  useEffect(()=>{
    getAll()
  },[])
const getAll = async() =>{
try {
  const mediaData = await API.graphql(graphqlOperation(listMedias))
  const mediaList = mediaData.data.listMedias.items
  console.log('media list',mediaList)
  setMedia(mediaList)
  console.log()
} catch (error) {
  console.log('error',error)
}
}

  return (
    <div className="App">
      <header >
       <AmplifySignOut/>
       <h2>My app Content</h2>
      </header>
      {media.map((item,i)=>{
        return(<div key ={i}><h2>{item.Title}</h2></div>)
      })}
    </div>
  );
}

export default withAuthenticator(App);
