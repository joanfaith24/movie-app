function MovieCard({ movie, isFavorite, onFavorite }) {
    const image = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const year = movie.release_date ? movie.release_date.split("-")[0]
                : movie.first_air_date ? movie.first_air_date.split("-")[0]
                : "N/A";
    const title = movie.title || movie.name;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer relative">
            {/* Favorite Button */}
            <button
                onClick={onFavorite}
                className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 cursor-pointer z-10">
                {isFavorite ? "⭐" : "☆"}
            </button>

            <img
                src={image}
                alt={title}
                className="w-full h-72 object-cover"
            />
            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg truncate">{title}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">{year}</span>
                    <span className="bg-yellow-400 text-white text-sm font-bold px-2 py-1 rounded-lg">
                        ⭐ {rating}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard