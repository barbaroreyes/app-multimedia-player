import React ,{useState,useEffect}from 'react'
import Amplyfy, { API, graphqlOperation,Storage } from 'aws-amplify';
import awsconfig from "./aws-exports";
import {AmplifySignOut,withAuthenticator} from '@aws-amplify/ui-react'
import {listMedias} from './graphql/queries';
import {updateMedia} from './graphql/mutations';
import {Paper,IconButton,} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import FavoriteIcon from '@material-ui/icons/Favorite';
import  PauseIcon from '@material-ui/icons/Pause';
import './App.css';
Amplyfy.configure(awsconfig)

function App() {
  const [medias,setMedia] =useState([])
  const [mediaPlaying,setMediaPlaying] = useState('')
  const [mediaUrl,setMediaUrl]= useState('')
  useEffect(()=>{
    getAll()
  },[])
  const toggleMedia = async (id) => {
    if(mediaPlaying === id){
      setMediaPlaying('')
      return 
    }
    const mediaFilePath= medias[id].filePath;
    try {
      const fileAccesUrl = await Storage.get(mediaFilePath,{expires:60})
      console.log("fileAcces Url",fileAccesUrl)
      setMediaPlaying(id)
      setMediaUrl(fileAccesUrl);
    return
    } catch (error) {
      console.log('error from s3 ',error)
      setMediaPlaying('')
      setMediaUrl('');
    }
    
  }


  
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
            <IconButton aria-label='play' onClick={()=>toggleMedia(i)}>
             {mediaPlaying ===i?<PauseIcon/>:<PlayArrowIcon/>}
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
          {
          
          mediaPlaying === id ?(
            <div>
              <ReactPlayer
              url={mediaUrl}
              control
              height='50px'
              onpause={()=>toggleMedia(i)}
              />
            </div>
          ): null
          }
          </Paper>)
      })}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
