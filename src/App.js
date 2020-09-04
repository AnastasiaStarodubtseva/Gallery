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
    <Link className="album" to={`/albums/${props.album.id}`}>
      <img alt='album cover' className='album-cover' src={props.album.coverPhoto}/>
      <p className='album-title'>{props.album.title}</p>
      <p className='album-length'>{props.album.photosLength}</p>
    </Link>
  )
}

function AlbumContents(props) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    document.addEventListener('keyup', function(event) {
      if(event.keyCode === 27) {
        setSelectedPhoto(null);
      } else if (event.keyCode === 39) {
        let currentIndex = props.photos.findIndex((photo) => {
          return photo && selectedPhoto && photo.id === selectedPhoto.id;
        });
        setSelectedPhoto(props.photos[currentIndex + 1])
      } else if (event.keyCode === 37) {
        let currentIndex = props.photos.findIndex((photo) => {
          return photo && selectedPhoto && photo.id === selectedPhoto.id;
        });
        setSelectedPhoto(props.photos[currentIndex - 1])
      }
    });
  });

  return (
    <div>
      <div className='container photo-list'>
        {photosForAlbum(1, props.photos).map((photo, i) => {
          return <Photo key={'photo-' + photo.thumbnailUrl} photo={photo} selectPhoto={setSelectedPhoto}/>
        })}
      </div>
      {selectedPhoto
        ? <div className='background' onClick={() => setSelectedPhoto(null)}>
            <img className='selected-photo' src={selectedPhoto.url}/>
          </div>
        : <div />
      }
    </div>
  );
}

function Photo(props) {
  return (
    <img alt='photo' src={props.photo.thumbnailUrl} onClick={() => props.selectPhoto(props.photo)} />
  )
}

function App() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/albums')
    .then(response => response.json())
    .then(json => setAlbums(json));

    fetch('https://jsonplaceholder.typicode.com/photos')
    .then(response => response.json())
    .then(json => setPhotos(json));
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/albums/:albumId'>
          <AlbumContents photos={photos} />
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