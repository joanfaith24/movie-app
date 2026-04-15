

import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import MovieList from './components/MovieList'
import MovieCard from './components/MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Load trending on first load
  useEffect(() => {
    fetchTrending();
  }, []);

  async function fetchTrending() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch{
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(pageNum = 1) {
    if(query.trim() === "") return;
    setLoading(true);
    setError("");
    setSearched(true);
    setPage(pageNum);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&page=${pageNum}`
      );
      const data = await response.json();
      const filtered = data.results.filter(
        item => item.media_type === "movie" || item.media_type === "tv"
      );
      setMovies(filtered);
      setTotalPages(data.total_pages);
    } catch{
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(movie) {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === movie.id);
      if(exists) return prev.filter(f => f.id !== movie.id);
      return [...prev, movie];
    });
  }

  function isFavorite(movie) {
    return favorites.some(f => f.id === movie.id);
  }

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    if(filter === "movie") return movie.media_type === "movie" || movie.title;
    if(filter === "tv") return movie.media_type === "tv" || movie.name;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-blue-500 mb-2">
          🎬 Movie & Anime Search
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Search for your favorite movies and anime!
        </p>

        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} onSearch={() => handleSearch(1)} />

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "movie", "tv"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500 hover:bg-blue-100"
              }`}>
              {type === "all" ? "🎬 All" : type === "movie" ? "🎥 Movies" : "📺 TV/Anime"}
            </button>
          ))}
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">⭐ Favorites ({favorites.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map(movie => (
                <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    onFavorite={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Title */}
        <h2 className="text-xl font-bold text-gray-600 mb-4">
          {searched ? `Results for "${query}"` : "🔥 Trending Today"}
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-center text-blue-500 text-lg font-bold">Loading...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-lg font-bold">{error}</p>
        )}

        {/* No Results */}
        {searched && !loading && filteredMovies.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No results found for "{query}" 😔
          </p>
        )}

        {/* Movie List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
              <MovieCard
                movie={movie}
                isFavorite={isFavorite(movie)}
                onFavorite={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handleSearch(page - 1)}
              disabled={page === 1}
              className="bg-white hover:bg-blue-100 text-gray-600 font-bold px-6 py-2 rounded-xl shadow transition-all duration-200 cursor-pointer disabled:opacity-50">
              ← Prev
            </button>
            <span className="bg-white text-gray-600 font-bold px-6 py-2 rounded-xl shadow">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handleSearch(page + 1)}
              disabled={page === totalPages}
              className="bg-white hover:bg-blue-100 text-gray-600 font-bold px-6 py-2 rounded-xl shadow transition-all duration-200 cursor-pointer disabled:opacity-50">
              Next →
            </button>
          </div>
        )}

        {/* Modal */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
              <img
                src={selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"}
                alt={selectedMovie.title || selectedMovie.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedMovie.title || selectedMovie.name}
                </h2>
                <div className="flex gap-3 mb-4">
                  <span className="bg-yellow-400 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    ⭐ {selectedMovie.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {selectedMovie.media_type === "movie" ? "🎥 Movie" : "📺 TV/Anime"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {selectedMovie.overview || "No description available."}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleFavorite(selectedMovie)}
                    className={`flex-1 font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      isFavorite(selectedMovie)
                        ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                        : "bg-gray-100 hover:bg-yellow-100 text-gray-600"
                    }`}>
                    {isFavorite(selectedMovie) ? "⭐ Unfavorite" : "☆ Add to Favorites"}
                  </button>
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App