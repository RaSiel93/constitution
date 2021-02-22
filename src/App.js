import React, {Component} from 'react'
import './styles/reset.css';
import './styles/App.css';
import Constitution from './fixtures/constitution.json'
import Article from './Article'
import Part from './Part'
import Modal from 'react-modal';

function articles() {
  return Constitution.sections.flatMap((section) => {
    return section.articles || section.parts.flatMap((part) => {
      return part.articles;
    })
  })
}

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    width                 : '80%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { search: '', section: Constitution.sections[0], showModal: false }
    this.articles = articles();
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.sections = document.getElementsByClassName('sections')[0];
  }

  setSection(section) {
    this.setState({ section: section, search: '' });
  }

  handleSearch(event) {
    this.setState({ search: event.target.value });
  }

  filteredArticles() {
    return this.articles.filter(
      (article) => {
        return (article.title + article.text).toLowerCase().search(this.state.search.toLowerCase()) !== -1;
      }
    );
  }

  toggleMenu(event) {
    event.target.closest('.menu').classList.toggle('active');
    return this.sections.classList.toggle('show');
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="App">
        <div className="menu" onClick={this.toggleMenu}>
          <span className="line1"></span>
          <span className="line2"></span>
          <span className="line3"></span>
        </div>
        <ul className="sections">
          <li className='search'>
            <input type="text" onChange={this.handleSearch} value={this.state.search} placeholder="Поиск"/>
          </li>
          {
            Constitution.sections.map((section) => {
              return <li key={Math.random()} className='section'>
                <a onClick={this.setSection.bind(this, section)} className={this.state.section == section ? 'active' : ''}>
                  {section.title}
                </a>
              </li>
            })
          }
          <li className='actions'>
            <button onClick={this.handleOpenModal}>Тест</button>
          </li>
        </ul>
        <div className="content">
          {
            this.state.search === ''
              ? <div>
                  <h1>{this.state.section.title}</h1>
                  <ul className="articles">
                    {this.state.section.parts != null
                      ? this.state.section.parts.map((part) => <Part key={Math.random()} part={part}/>)
                      : this.state.section.articles.map((article) => <Article key={Math.random()} article={article}/>)
                    }
                  </ul>
                </div>
              : <div>
                <ul>
                  {
                    this.filteredArticles().map((article) => <Article key={Math.random()} article={article}/>)
                  }
                </ul>
              </div>
          }
        </div>
        <div>
          <Modal style={customStyles} isOpen={this.state.showModal}>
            <p style={{position: 'absolute', top: '10px', right: '10px', cursor: 'pointer'}} onClick={this.handleCloseModal}>X</p>
            <ul>
              <Article key={Math.random()} article={this.articles[Math.floor(Math.random() * this.articles.length)]}/>
            </ul>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
