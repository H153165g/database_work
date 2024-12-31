import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Kids from "./Kids";
import CrPa from "./CreateParent";
import Parent from "./Parent";
import Addacount from "./Addacount";
import Study from "./Study";
import Writestudy from "./Writestudy";
import Items from "./Items";
import "./App.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <header>
          <Link to="/">
            <h1>勉強でお金を稼ごう!</h1>
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="kid" element={<Kids />} />
          <Route path="parent" element={<Parent />} />
          <Route path="parent/item" element={<Items />} />
          <Route path="parent/crpa" element={<CrPa />} />
          <Route path="login/addacount" element={<Addacount />} />
          <Route path="kid/study" element={<Study />} />
          <Route path="kid/study/write" element={<Writestudy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
