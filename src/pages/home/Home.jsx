import ToolCarousel from './components/ToolCarousel.jsx';
import ExtraCarousel from './components/ExtraCarousel.jsx';
import HomeBlog from './components/HomeBlog.jsx';

import './Home.css'

export function Home() {
  return (
    <>
      <h2>Tools</h2> 
      <ToolCarousel/>
      <h2>Extras</h2> 
      <ExtraCarousel/>
      <h2>Updates</h2> 
      <HomeBlog/>
    </>
  )
}

export default Home