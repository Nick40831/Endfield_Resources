import { Link } from 'react-router-dom'
import './CarouselIcon.css'

function CarouselIcon({ img, title, className, link }) {
  return (
    <>
      <Link to = { link }>
        <button className={ className }>
          <img src={ img }/>
          <p>{ title }</p>
        </button>
      </Link>
    </>
  )
}

export default CarouselIcon