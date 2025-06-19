import React from "react";
import { Routes, Route} from "react-router-dom";
import Login from "./Components/Login.jsx";
import Feed from "./Components/Feed.jsx";

function App () {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/feed" element={<Feed />}/>
    </Routes>
  )
}

export default App;