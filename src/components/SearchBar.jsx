

function SearchBar({ query, setQuery, onSearch }) {
    return (
        <div className="flex gap-2 mb-8">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="Search movies or anime..."
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 w-0"
            />
            <button
                onClick={onSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-xl transition-all duration-200 cursor-pointer shrink-0">
                Search
            </button>
        </div>
    );
}

export default SearchBar