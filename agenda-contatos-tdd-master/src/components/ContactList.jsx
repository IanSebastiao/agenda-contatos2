import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteContact, getContacts } from '../services/contactService';
import formatPhone from '../utils/formatPhone';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteContact(contactToDelete.id);
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));
      setShowDeleteModal(false);
      setContactToDelete(null);
    } catch (err) {
      setError('Erro ao excluir contato');
      console.error(err);
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        setError('Erro ao carregar contatos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando contatos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        {error}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="container alert alert-info my-4 text-center" role="alert">
        Nenhum contato cadastrado.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && contactToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button type="button" className="btn-close" onClick={handleDeleteCancel}></button>
              </div>
              <div className="modal-body">
                <p>
                  Tem certeza que deseja excluir o contato <strong>"{contactToDelete.nome}"</strong>?
                  <br />
                  <span className="text-muted">Esta ação não pode ser desfeita.</span>
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Contatos</h2>
        <div>
          <span className="badge rounded-pill bg-secondary me-2">
            {contacts.length} {contacts.length === 1 ? 'contato' : 'contatos'}
          </span>
        </div>
      </div>

      {/* Versão para desktop (table) */}
      <div className="d-none d-lg-block">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <strong>{contact.nome}</strong>
                    {contact.favorito && (
                      <span className="ms-2 text-warning">★</span>
                    )}
                  </td>
                  <td>{contact.email}</td>
                  <td>{formatPhone(contact.telefone)}</td>
                  <td className="text-end">
                    <div className="d-flex gap-2 justify-content-end">
                      <Link
                        to={`/editar/${contact.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteClick(contact)}
                        title="Remover"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Versão para mobile (cards) */}
      <div className="d-lg-none">
        <div className="row g-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title mb-1">
                        {contact.nome}
                        {contact.favorito && (
                          <span className="ms-2 text-warning">★</span>
                        )}
                      </h5>
                      <p className="card-text mb-1 text-muted small">
                        <i className="bi bi-envelope me-1"></i>
                        {contact.email}
                      </p>
                      <p className="card-text text-muted small">
                        <i className="bi bi-telephone me-1"></i>
                        {formatPhone(contact.telefone)}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/editar/${contact.id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteClick(contact)}
                        title="Remover"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList;