import './styles/Article.css';

function Article({ article }) {
  return <li key={Math.random()} className='article'>
    <p><span>{article.title}.</span> {article.text}</p>
  </li>
}

export default Article;