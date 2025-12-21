import { useState } from 'react'
import { HashRouter as Router, Routes, Route  } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/home/Home.jsx'
import { Simulation } from './pages/Simulation.jsx'
import { HeadHunting } from './pages/HeadHunting.jsx'
import { ArsenalExchange } from './pages/ArsenalExchange.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <div id='content'>
        <Router>
          <Routes>
            <Route path='/' element={ <Home/> }/>
            <Route path='/simulator' element={ <Simulation/> }/>
            <Route path='/head_hunting' element={ <HeadHunting/> }/>
            <Route path='/arsenal_exhange' element={ <ArsenalExchange/> }/>
          </Routes>
        </Router>
      </div>
      <Footer/>
    </>
  )
}

export default App
