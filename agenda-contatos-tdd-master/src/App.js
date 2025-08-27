import { NavLink, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import ContactList from './components/ContactList';
import { addContact } from './services/contactService';
import EditContact from './components/EditContact';
import ContactForm from './components/ContactForm';

const Home = () => <h2>Bem-vindo ao Gerenciador de Contatos</h2>;

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleAddContact = async (contact) => {
    try {
      await addContact(contact);
      alert('Contato cadastrado com sucesso!');
      navigate('/contatos');
    } catch (error) {
      console.error('Erro ao cadastrar contato:', error);
      alert('Erro ao cadastrar contato.');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Gerenciador</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contatos">Listar contatos</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/novo">Cadastrar contato</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contatos' element={<ContactList />} />
        <Route path='/novo' element={<ContactForm onSubmit={handleAddContact} />} />
        <Route path="/editar/:id" element={<EditContact />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
