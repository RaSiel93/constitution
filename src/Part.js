import './styles/Part.css'
import Article from './Article'

function Part({ part }) {
  return <div className="part" key={Math.random()} >
    <h2 key={Math.random()}>{part.title}</h2>
    {part.articles.map((article) =>
      <Article article={article}/>
    )}
  </div>
}

export default Part;