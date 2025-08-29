import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ContactList from '../components/ContactList';
import * as service from '../services/contactService';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

jest.mock('../services/contactService');

//Função auxiliar para renderizar com router
const renderWithRouter = (ui) => render (
    <MemoryRouter>{ui}</MemoryRouter>
);

//Ignorar warnings do React Routen
beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

test('exibe mensagem quando não há contatos cadastrados', async () => {
    // Simula resposta vazia do serviço
    service.getContacts.mockResolvedValue([]);

    renderWithRouter(<ContactList />);

    //usar findByText para esperar a mensagem
    const messageElement = await screen.findByText(/nenhum contato cadastrado/i);
    expect(messageElement).toBeInTheDocument();
});

test('exibe lista de contatos', async () => {
    service.getContacts.mockResolvedValue([
        { id: '1', nome: 'Ana', email: 'ana@email.com', telefone: '123456789' },
        { id: '2', nome: 'João', email: 'joao@email.com', telefone: '987654321' },
    ]);

    renderWithRouter(<ContactList />);


    await waitFor(() => {
        //Verifica se a tabela ou cards estão presentes
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Lista de Contatos')).toBeInTheDocument();
    });

    //Verifica se os nomes estão presentes (usando getAllByText ja que há multiplas ocorrências)
    const anaElements = screen.getAllByText('Ana');
    const joaoElements= screen.getAllByText('João');

    expect(anaElements.length).toBeGreaterThan(0);
    expect(joaoElements.length).toBeGreaterThan(0);

    //Verificar se pelo menos um elemento de cada esta visivel
    expect(anaElements[0]).toBeInTheDocument();
    expect(joaoElements[0]).toBeInTheDocument();
});

test('deleta um contato ao clicar em "Remover"', async () => {
    const deleteContactMock = jest.fn().mockResolvedValue(); // mock async
    service.getContacts.mockResolvedValue([
        { id: '1', nome: 'Ana', email: 'ana@email.com', telefone: '123' },
    ]);
    service.deleteContact = deleteContactMock.mockResolvedValue({});

    renderWithRouter(<ContactList />);

    //Esoera o contato ser carregado verificado um elemento unico
    await screen.findByText('Lista de Contatos');


    //Verificar que o contato está presente antes de deletar 
    const anaElementsBefore = screen.getAllByText('Ana')
    expect(anaElementsBefore.length).toBeGreaterThan(0);

    //Encontrar todos os botões de remover e clicar no primeiro
    const removeButtons = screen.getAllByTitle(/remover/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
        expect(deleteContactMock).toHaveBeenCalledWith('1');
    });

    //Verifica se a função de deletar foi chamada
    await waitFor(() => {
        const anaElementsAfter = screen.queryAllByText('Ana')
        expect(anaElementsAfter.length).toBe(0);
    })

});

test('atualiza contato existente', () => {
    const handleSubmit = jest.fn();
    const contatoExistente = {
        nome: 'Ana',
        email: 'ana@email.com',
        telefone: '123',
    };

    render(<ContactForm contact={contatoExistente} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana Paula'} });
    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmit).toHaveBeenCalledWith({
        nome: 'Ana Paula',
        email: 'ana@email.com',
        telefone: '123',
    });
});

//Limpar mocks após os testes
afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.restoreAllMocks();
});