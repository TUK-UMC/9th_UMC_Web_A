import axios from "axios";

export const tmdbAPI = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    Accept: "application/json",
  },
});
