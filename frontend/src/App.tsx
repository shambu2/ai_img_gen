
import { Route, Routes } from 'react-router-dom'
import './App.css'
// import homes from './pages/homes'
import Homes from './pages/homes'
import Instagram from './pages/instagram'
import Youtube from './pages/youtube'
function App() {
  

  return (
   <Routes>
    <Route path="/" element={<Homes/>}/>
    <Route path="/instagram" element={<Instagram/>}/>
    <Route path="/youtube" element={<Youtube/>}/>
   </Routes>
  )
}

export default App
