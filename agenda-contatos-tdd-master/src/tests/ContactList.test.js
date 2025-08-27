import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ContactList from '../components/ContactList';
import * as service from '../services/contactService';
import { MemoryRouter } from 'react-router-dom';

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
        expect(screen.getByText('Ana')).toBeInTheDocument();
        expect(screen.getByText('João')).toBeInTheDocument();
    });
});

test('deleta um contato ao clicar em "Remover"', async () => {
    const deleteContactMock = jest.fn().mockResolvedValue(); // mock async
    service.getContacts.mockResolvedValue([
        { id: '1', nome: 'Ana', email: 'ana@email.com', telefone: '123' },
    ]);
    service.deleteContact = deleteContactMock;

    renderWithRouter(<ContactList />);

    await waitFor(() => {
        expect(screen.getByText('Ana')).toBeInTheDocument();
    });

    // Dispara o clique
    fireEvent.click(screen.getByText(/remover/i));

    // Garante que a função de serviço foi chamada
    expect(deleteContactMock).toHaveBeenCalledWith('1');

    // Aguarda atualização da UI (removeu o contato)
    await waitFor(() => {
        expect(screen.queryByText('Ana')).not.toBeInTheDocument();
    });
});
