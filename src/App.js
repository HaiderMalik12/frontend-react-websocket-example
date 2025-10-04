import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Success from './components/Success'
import Cancel from './components/Cancel';
import Home from './components/Home';


function App() {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Home/>}/>
       <Route path='/billing/sucess' element={<Success/>}/>
       <Route path='/billing/cancel' element={<Cancel/>}/>
    </Routes>
   </Router>
  );
}

export default App;
