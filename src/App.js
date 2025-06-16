import { Routes, Route} from "react-router-dom";
import Login from "./Components/Login";
import UserList from "./Components/UsersList";

function App () {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/users" element={< UserList/>}/>
    </Routes>
  )
}

export default App;