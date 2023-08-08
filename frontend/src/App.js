import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Register from "./pages/users/Register";
import Login from "./pages/users/Login";
import Profile from "./pages/users/Profile";
import NavBar from "./components/NavBar";
import { UserProvider } from "./Context/UserContext";
import Container from "./components/Container";
import AddPet from './pages/pets/AddPet'

function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <NavBar />
          <Container>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/user/profile" element={<Profile />} />
            <Route exact path="/pet/create" element={<AddPet />} />
          </Routes>
          </Container>
        </UserProvider>
      </Router>

    </div>
  );
}

export default App;
