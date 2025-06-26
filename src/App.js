import { Routes, Route} from "react-router-dom";
import Login from "./Components/Login.jsx";
import Feed from "./Components/Feed.jsx";
import Chat from "./Components/Chat.jsx";

function App () {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/feed" element={<Feed />}/>
      <Route path="/chat" element={<Chat currentUser={localStorage.getItem("user")} />} />
    </Routes>
  )
}

export default App;