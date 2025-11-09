import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

function App() {  
  return (
    <>
      <main>
        <Routes>
          {/* Not protected ulrs */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>

          {/* Protected urls */}
          <Route element = {<ProtectedRoute/>}>
            <Route element = {<Layout/>}>
              <Route path="/" element={<Home />} />
            </Route>
          </Route>

        </Routes>
      </main>
    </>
  )
}

export default App;
