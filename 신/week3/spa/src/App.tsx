import "./App.css";
import { Link } from "../components/Link";
import { Route } from "./Route";
import { Routes } from "./Router";

const ShinPage = () => <h1>신 페이지</h1>;
const ChaniPage = () => <h1>차니 페이지</h1>;
const HowuPage = () => <h1>호우 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: "flex", gap: "10px" }}>
      <Link to="/shin">SHIN</Link>
      <Link to="/chani">CHANI</Link>
      <Link to="/howu">HOWU</Link>
      <Link to="/not-found">NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/shin" component={ShinPage} />
        <Route path="/chani" component={ChaniPage} />
        <Route path="/howu" component={HowuPage} />
        <Route path="/not-found" component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;
