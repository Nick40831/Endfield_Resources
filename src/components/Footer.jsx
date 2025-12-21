import './Footer.css'
import logo from '../assets/CreatorMark.png';

function Footer() {
  return (
    <>
      <div id='footer'>
        <a href='https://github.com/Nick40831/Endfield_Resources' target='_blank' rel='noopener noreferrer'>GitHub</a>
        <p>The factory must grow!</p>
        <a href='https://github.com/Nick40831' target='_blank' rel='noopener noreferrer'><img src={logo}/></a>
      </div>
    </>
  )
}

export default Footer