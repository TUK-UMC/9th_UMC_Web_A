import axios from "axios";

export const tmdbAPI = axios.create({
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    Accept: "application/json",
  },
});
