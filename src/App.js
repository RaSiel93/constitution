import React, {Component} from 'react'
import './styles/reset.css';
import './styles/App.css';
import ConstitutionRU from './fixtures/constitution.ru.json'
import ConstitutionBY from './fixtures/constitution.by.json'
import Article from './Article'
import Part from './Part'
import Modal from 'react-modal';


Modal.setAppElement('#root');

const constitution = {
  'by': ConstitutionBY,
  'ru': ConstitutionRU
}

class App extends Component {
  constructor(props) {
    super(props);
    const lang = 'by';

    this.state = { lang: lang, search: '', constitution: constitution[lang], section: null, showModal: false }
    this.articles = this.loadArticles();
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  loadArticles() {
    return this.state.constitution.sections.flatMap((section) => {
      return section.articles || section.parts.flatMap((part) => part.articles)
    })
  }

  componentDidMount() {
    this.sections = document.getElementsByClassName('sections')[0];
  }

  setSection(section) {
    if (this.state.section == section) {
      section = null;
    }
    this.setState({ section: section });
  }

  handleSearch(event) {
    this.setState({ search: event.target.value });
  }

  filteredArticles() {
    let articles = null;

    if(this.state.section !== null) {
      articles = this.state.section.articles || this.state.section.parts.flatMap((part) => part.articles);
    } else {
      articles = this.articles;
    }

    return articles.filter(
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

  setLang(lang) {
    const id = this.state.constitution.sections.indexOf(this.state.section);
    let section = null

    if (id != -1) {
      section = constitution[lang].sections[id];
    }

    this.setState({ lang: lang, constitution: constitution[lang], section: section }, () => {
      this.articles = this.loadArticles();
    });
  }

  t(key) {
    return {
      by: {
        test: 'Выпадковы артыкул',
        next: 'Наступны'
      },
      ru: {
        test: 'Случайная статья',
        next: 'Следующая'
      }
    }[this.state.lang][key];
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
          <li className="lang">
            <a onClick={this.setLang.bind(this, 'by')} className={this.state.lang == 'by' ? 'active' : ''}>BY</a>
            |
            <a onClick={this.setLang.bind(this, 'ru')} className={this.state.lang == 'ru' ? 'active' : ''}>RU</a>
          </li>
          <li className='search'>
            <input type="text" onChange={this.handleSearch} value={this.state.search} placeholder="Поиск"/>
          </li>
          {
            this.state.constitution.sections.map((section) => {
              return <li key={Math.random()} className='section'>
                <a onClick={this.setSection.bind(this, section)} className={this.state.section == section ? 'active' : ''}>
                  {section.title}
                </a>
              </li>
            })
          }
          <li className='actions'>
            <button onClick={this.handleOpenModal}>{this.t('test')}</button>
          </li>
        </ul>
        <div className="content">
          {
            this.state.search === ''
              ? this.state.section !== null
                ? <div>
                    <h1>{this.state.section.title}</h1>
                    <ul className="articles">
                      {this.state.section.parts != null
                        ? this.state.section.parts.map((part) => <Part key={Math.random()} part={part}/>)
                        : this.state.section.articles.map((article) => <Article key={Math.random()} article={article}/>)
                      }
                    </ul>
                  </div>
                : <div className='main'>
                    <h1>{this.state.constitution.title}</h1>
                    <p>{this.state.constitution.description}</p>
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
          <Modal isOpen={this.state.showModal} className='Modal' onRequestClose={this.handleCloseModal}>
            <p className='close' onClick={this.handleCloseModal}>×</p>
            <ul>
              <Article key={Math.random()} article={this.articles[Math.floor(Math.random() * this.articles.length)]}/>
            </ul>
            <div className="actions">
              <button onClick={this.handleOpenModal}>{this.t('next')}</button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
