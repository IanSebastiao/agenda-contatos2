import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContactById, updateContact } from '../services/contactService';
import ContactForm from './ContactForm';

const EditContact = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const data = await getContactById(id);
                setContact(data);
            } catch (err) {
                setError('Erro ao carregar contato');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            await updateContact(id, formData);
            navigate('/contatos', { state: { success: 'Contato atualizado com sucesso!' } });
        } catch (err) {
            setError('Erro ao atualizar contato');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2">Carregando contato...</p>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="alert alert-danger my-4" role="alert">
                Contato não encontrado.
                <button
                    className="btn btn-link p-0 ms-2"
                    onClick={() => navigate('/contatos')}
                >
                    Voltar para lista
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-dark text-white">
                    <h2 className="mb-0">Editar Contato</h2>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <ContactForm contact={contact} onSubmit={handleSubmit} />

                    <div className="mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/contatos')}
                        >
                            <i className="bi bi-arrow-left me-1"></i> Voltar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditContact;