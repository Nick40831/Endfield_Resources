import './Blog.css'

function Blog({ children }) {
  return (
    <>
      <div className='blogBody'>
        {children}
      </div>
    </>
  )
}

export default Blog