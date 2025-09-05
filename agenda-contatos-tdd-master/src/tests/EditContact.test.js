import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as contactService from '../services/contactService';
import EditContact from '../components/EditContact';

jest.mock('../services/contactService');

// Ignorar warnings do React Router
beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});

const renderPage = (initialRoute = '/contacts/1') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/contacts/:id" element={<EditContact />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('EditContact', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza o formulário com dados do contato', async () => {
        contactService.getContactById.mockResolvedValueOnce({
            id: 1,
            nome: 'Ana',
            email: 'ana@email.com',
            telefone: '(11) 9 8888-7777', 
        });

        renderPage();

        // Aguarda o carregamento e verifica os valores
        expect(await screen.findByDisplayValue('Ana')).toBeInTheDocument();
        expect(await screen.findByDisplayValue('ana@email.com')).toBeInTheDocument();
        expect(await screen.findByDisplayValue('(11) 9 8888-7777')).toBeInTheDocument();
    });

    test('exibe mensagem de erro se falhar ao buscar contato', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        contactService.getContactById.mockRejectedValueOnce(new Error('Erro ao carregar'));

        renderPage();

        // Verifique a mensagem real que aparece na UI
        expect(await screen.findByText(/contato não encontrado/i)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    test('atualiza o contato com sucesso', async () => {
        contactService.getContactById.mockResolvedValueOnce({
            id: 1,
            nome: 'Ana',
            email: 'ana@email.com',
            telefone: '(11) 9 8888-7777', // Corrigido para match com o formato exibido
        });

        contactService.updateContact.mockResolvedValueOnce({
            id: 1,
            nome: 'Ana Maria',
            email: 'ana@email.com',
            telefone: '(11) 9 8888-7777',
        });

        renderPage();

        // Aguarda o carregamento completo antes de interagir
        await screen.findByDisplayValue('Ana');

        // Usa await para garantir que o elemento está disponível
        const inputNome = await screen.findByDisplayValue('Ana');

        // Altera o nome dentro de act para evitar warnings
        await act(async () => {
            fireEvent.change(inputNome, { target: { value: 'Ana Maria' } });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
        });

        await waitFor(() =>
            expect(contactService.updateContact).toHaveBeenCalledWith("1", {
                nome: 'Ana Maria',
                email: 'ana@email.com',
                telefone: '(11) 9 8888-7777',
            })
        );
    });

    test('exibe mensagem de erro se falhar ao atualizar', async () => {

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        contactService.getContactById.mockResolvedValueOnce({
            id: 1,
            nome: 'Ana',
            email: 'ana@email.com',
            telefone: '(11) 9 8888-7777', // Corrigido para match com o formato exibido
        });

        contactService.updateContact.mockRejectedValueOnce(new Error('Erro ao salvar'));

        renderPage();

        // Aguarda o carregamento completo
        await screen.findByDisplayValue('Ana');

        const inputNome = await screen.findByDisplayValue('Ana');

        await act(async () => {
            fireEvent.change(inputNome, { target: { value: 'Ana Maria' } });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
        });

        // Verifique a mensagem real que aparece na UI
        expect(await screen.findByText(/erro ao atualizar contato/i)).toBeInTheDocument();

        consoleSpy.mockRestore(); // restaura comportamento normal
    });
});