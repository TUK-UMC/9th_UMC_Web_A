import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
  const params = useParams();

  return <div>MovieDetailPage{params.movieId}</div>;
};

export default MovieDetailPage;
