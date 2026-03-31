import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService.ts";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";


import ReactPaginate from "react-paginate/dist/react-paginate";

import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query, 
    placeholderData: (prev) => prev,
   });
  
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };


  useEffect(() => {
  if (data && page === 1 && data.results.length === 0) {
    toast.error("No movies found for your request.");
  }
  }, [data, page]);
  
 


  return (
    <div>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

       {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

       {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );

  console.log(ReactPaginate)
}

