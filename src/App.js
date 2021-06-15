import React ,{useState,useEffect}from 'react'
import Amplyfy, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from "./aws-exports";
import {AmplifySignOut,withAuthenticator} from '@aws-amplify/ui-react'
import {listMedias} from './graphql/queries';
import {updateMedia} from './graphql/mutations';
import {Paper,IconButton,} from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow'
import FavoriteIcon from '@material-ui/icons/Favorite';
import './App.css';
Amplyfy.configure(awsconfig)
function App() {
  const [medias,setMedia] =useState([])
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
const addLike = async(id) =>{
try {
  const media = medias[id]
  media.like= media.like + 1
  delete media.createdAt;
  delete media.updatedAt;


  const mediaData = await API.graphql(graphqlOperation(updateMedia,{input:media}))
  const mediaList = [...medias]
 mediaList[id] = mediaData.data.updateMedia;
 setMedia(mediaList)

} catch (error) {
  console.log('error on addLike function',error)
}
}
  return (
    <div className="App">
      <header className='App-header'>
       <AmplifySignOut/>
       <h2>My app Content</h2>
      </header>
      <div className='mediaList'>
      {medias.map((item,i)=>{
        return(<Paper 
          variant="outlined"
          elevation={2} 
          key ={i}>
          <div className='media-box'>
            <IconButton aria-label='play'>
              <PlayArrow/>
          </IconButton>
          <div>
          <div className='Title'>{item.Title}</div>
          <div className='owner'>{item.owner}</div>
          </div>
          <div>
          <IconButton aria-label='like' onClick ={()=>{addLike(i)}}>
              <FavoriteIcon/>
          </IconButton>
          {item.like}
          </div>
          <div className='description'>
           {item.description}
          </div>
         

          </div>
          </Paper>)
      })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
