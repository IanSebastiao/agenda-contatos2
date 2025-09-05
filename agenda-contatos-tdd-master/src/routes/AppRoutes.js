import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HomePage from '../pages/HomePage';
import { addContact } from '../services/contactService';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import EditContact from '../components/EditContact';

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
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contatos" element={<ContactList />} />
        <Route path="/novo" element={<ContactForm onSubmit={handleAddContact} />}        />
        <Route path="/editar/:id" element={<EditContact />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;