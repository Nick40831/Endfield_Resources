import './BlogPost.css'

export function BlogPost({ title, date, content }) {
  return (
    <>
      <div className='blogPost'>
        <h3>{ title }</h3>
        <p><em>{ date }</em></p>
        <p>{ content }</p>
      </div>
    </>
  )
}

export default BlogPost