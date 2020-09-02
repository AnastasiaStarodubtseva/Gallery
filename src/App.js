import React, {useState, useEffect} from 'react'
import './css/App.scss'
import './css/normalize.css'
import './css/skeleton.css'

function take(n, xs) {
  var result = [];
  for (var i = 0; i < Math.min(n, xs.length); i++) {
    result.push(xs[i]);
  }
  return result;
}

function albumsWithAuthors(albums, authors) {
  var result = [];
  var author;
  for (var i = 0; i < albums.length; i++) {
    author = authors.filter(author => albums[i].albumId === author.id)[0];
    result.push({
      title: albums[i].title,
      author: (author ? author.name : ''),
      id: albums[i].id
    });
  }
  return result;
}

function Album(props) {
  return (
    <div className="album">
      <p className='title'>{props.album.title}</p>
      <p className='author'>{props.album.author}</p>
    </div>
  )
}

function App() {
  const [albums, setAlbums] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
    .then(response => response.json())
    .then(json => setAlbums(json));
  }, []);

  function filterAlbums(album) {
    return query
      ? album.author.toUpperCase().includes(query.toUpperCase())
      : true;
  }

  return (
    <div className="container">
    <div className="search">
      <i className="fas fa-search"></i>
      <input
        type="search"
        id="filter"
        placeholder="Filter by album..."
      />
    </div>

    <div className="albums">
      {take(300, albumsWithAuthors(albums, authors).filter(filterAlbums)).map((album, i) => {
        return <Album key={"album-" + album.id} album={album} />
      })}
    </div>

  </div>
  )
}

export default App;
