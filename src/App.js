import React, {useState, useEffect} from 'react'
import './css/App.scss'
import './css/normalize.css'
import './css/skeleton.css'

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

console.log(photosForAlbum);

function Album(props) {
  return (
    <div className="album" onClick={() => props.focusOnAlbum(props.album.id)}>
      <img alt="album cover" className='photo' src={props.album.coverPhoto}/>
      <p className='title'>{props.album.title}</p>
      <p className='author'>{props.album.author}</p>
      <p className='album-length'>{props.album.photosLength}</p>
    </div>
  )
}

function App() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [albumInFocus, setAlbumInFocus] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/albums')
    .then(response => response.json())
    .then(json => setAlbums(json));

    fetch('https://jsonplaceholder.typicode.com/photos')
    .then(response => response.json())
    .then(json => setPhotos(json));
  }, []);

  return (
    <div className="container">
      <div className="albums">
        {albumInFocus
          ? photosForAlbum(albumInFocus, photos)
          : albumsWithPhotos(albums, photos).map((album, i) => {
              return <Album key={"album-" + album.id} album={album} focusOnAlbum={setAlbumInFocus} />
            })
        }
      </div>
    </div>
  )
}

export default App;