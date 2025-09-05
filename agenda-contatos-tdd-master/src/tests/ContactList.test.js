import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import * as service from '../services/contactService';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/contactService');

// Função auxiliar para renderizar com router
const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

// Ignorar warnings do React Router
beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

test('exibe mensagem quando não há contatos cadastrados', async () => {
    service.getContacts.mockResolvedValue([]);

    renderWithRouter(<ContactList />);

    // Usar findByText para esperar a mensagem
    const messageElement = await screen.findByText(/nenhum contato cadastrado/i);
    expect(messageElement).toBeInTheDocument();
});

test('exibe lista de contatos', async () => {
    service.getContacts.mockResolvedValue([
        { id: '1', nome: 'Ana', email: 'ana@email.com', telefone: '123456789' },
        { id: '2', nome: 'João', email: 'joao@email.com', telefone: '987654321' },
    ]);

    renderWithRouter(<ContactList />);

    // Verificar se a lista foi carregada procurando por elementos únicos
    await waitFor(() => {
        // Verificar se a tabela ou cards estão presentes
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Lista de Contatos')).toBeInTheDocument();
    });

    // Verificar se os nomes estão presentes (usando getAllByText já que há múltiplas ocorrências)
    const anaElements = screen.getAllByText('Ana');
    const joaoElements = screen.getAllByText('João');

    expect(anaElements.length).toBeGreaterThan(0);
    expect(joaoElements.length).toBeGreaterThan(0);

    // Verificar se pelo menos um elemento de cada está visível
    expect(anaElements[0]).toBeInTheDocument();
    expect(joaoElements[0]).toBeInTheDocument();
});

test('deleta um contato ao clicar em "Remover"', async () => {
    const deleteContactMock = jest.fn();
    service.getContacts.mockResolvedValue([
        { id: '1', nome: 'Ana', email: 'ana@email.com', telefone: '123' },
    ]);
    service.deleteContact = deleteContactMock.mockResolvedValue({});

    renderWithRouter(<ContactList />);

    // Esperar a lista carregar
    await screen.findByText('Lista de Contatos');

    // Verificar que o contato aparece pelo menos uma vez
    const anaElementsBefore = screen.getAllByText('Ana');
    expect(anaElementsBefore.length).toBeGreaterThan(0);

    // Clicar no botão "Remover"
    const removeButton = screen.getAllByTitle(/remover/i)[0];
    fireEvent.click(removeButton);

    // Confirmar exclusão no modal (seleciona o botão)
    const confirmButton = await screen.findByRole('button', { name: /excluir/i });
    fireEvent.click(confirmButton);

    // Verificar se deleteContact foi chamado
    await waitFor(() => {
        expect(deleteContactMock).toHaveBeenCalledWith('1');
    });

    // Verificar se contato foi removido
    await waitFor(() => {
        const anaElementsAfter = screen.queryAllByText('Ana');
        expect(anaElementsAfter.length).toBe(0);
    });
});

test('atualiza contato existente', () => {
    const handleSubmit = jest.fn();
    const contatoExistente = {
        nome: 'Ana',
        email: 'ana@email.com',
        telefone: '123',
    };

    render(<ContactForm contact={contatoExistente} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana Paula' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmit).toHaveBeenCalledWith({
        nome: 'Ana Paula',
        email: 'ana@email.com',
        telefone: '123',
    });
});

// Limpar mocks após os testes
afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.restoreAllMocks();
});