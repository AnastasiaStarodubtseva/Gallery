import React, {useState, useEffect} from 'react'
import './css/App.scss'
import './css/normalize.css'
import './css/skeleton.css'
import { Switch, Route, Link, BrowserRouter as Router } from 'react-router-dom'


function albumsWithPhotos(albums, photos) {
  var result = [];
  for (var i = 0; i < albums.length; i++) {
    let albumPhotos = photosForAlbum(albums[i].id, photos);
    result.push({
      title: albums[i].title,
      coverPhoto: albumPhotos[0] ? albumPhotos[0].thumbnailUrl : '',
      id: albums[i].id,
      photosLength: photosForAlbum.length
    });
  }
  return result;
}

function photosForAlbum(albumId, photos) {
  return photos.filter(photo => albumId === photo.albumId);
}

function Album(props) {
  return (
    <Link to={`/albums/${props.album.id}`}>
      <div className='album'>
        <img alt='album cover' className='photo' src={props.album.coverPhoto}/>
        <p className='title'>{props.album.title}</p>
        <p className='author'>{props.album.author}</p>
        <p className='album-length'>{props.album.photosLength}</p>
      </div>
    </Link>
  )
}

function Photo(props) {
  return (
    <img alt='photo' src={props.photo.thumbnailUrl} onClick={() => props.selectPhoto(props.photo)} />
  )
}

function App() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/albums')
    .then(response => response.json())
    .then(json => setAlbums(json));

    fetch('https://jsonplaceholder.typicode.com/photos')
    .then(response => response.json())
    .then(json => setPhotos(json));
  }, []);

  console.log(selectedPhoto);

  return (
    <Router>
      <Switch>
        <Route path='/albums/:albumId'>
          <div className='photo-list'>
            {photosForAlbum(1, photos).map((photo, i) => {
              return <Photo key={'photo-' + photo.thumbnailUrl} photo={photo} selectPhoto={setSelectedPhoto} />
            })}
            {selectedPhoto
              ? <div className='background'> <img className='selected-photo' src={selectedPhoto.url}/></div>
              : <div></div>
            }
          </div>
        </Route>
        <Route path='/'>
          <div className='container'>
            <h2 className='header'>Select an album</h2>
            <div className='albums'>
              {albumsWithPhotos(albums, photos).map((album, i) => {
                return <Album key={'album-' + album.id} album={album} />
              })}
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;