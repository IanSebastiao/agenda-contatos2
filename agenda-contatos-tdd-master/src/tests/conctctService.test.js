// contactService.test.js
import {
    getContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact
} from '../services/contactService';
import { supabase } from '../services/supabase';

// Mock do Supabase
jest.mock('../services/supabase', () => ({
    supabase: {
        from: jest.fn()
    }
}));

describe('Contact Service', () => {
    // =========================
    // GET CONTACTS
    // =========================
    describe('getContacts', () => {
        test('deve listar os contatos', async () => {
            const fakeContacts = [
                { nome: 'Maria', email: 'maria@email.com', telefone: '11999999999' },
                { nome: 'João', email: 'joao@email.com', telefone: '22999999999' }
            ];

            const mockSelect = jest.fn().mockResolvedValue({ data: fakeContacts, error: null });
            supabase.from.mockReturnValue({ select: mockSelect });

            const result = await getContacts();

            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(result).toEqual(fakeContacts);
        });

        test('deve lançar erro se o Supabase retornar erro', async () => {
            const mockSelect = jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Erro ao listar')
            });
            supabase.from.mockReturnValue({ select: mockSelect });

            await expect(getContacts()).rejects.toThrow('Erro ao listar');
        });
    });

    // =========================
    // GET CONTACT BY ID
    // =========================
    describe('getContactById', () => {
        test('deve retornar o contato pelo ID', async () => {
            const id = 1;
            const fakeContact = {
                id: 1,
                nome: 'Maria Souza',
                email: 'maria@email.com',
                telefone: '11999999999'
            };

            const mockSingle = jest.fn().mockResolvedValue({ data: fakeContact, error: null });
            const mockEq = jest.fn(() => ({ single: mockSingle }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ select: mockSelect });

            const result = await getContactById(id);

            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockEq).toHaveBeenCalledWith('id', id);
            expect(mockSingle).toHaveBeenCalled();
            expect(result).toEqual(fakeContact);
        });

        test('deve lançar erro se o Supabase retornar erro', async () => {
            const id = 2;
            const fakeError = new Error('Erro ao buscar contato');

            const mockSingle = jest.fn().mockResolvedValue({ data: null, error: fakeError });
            const mockEq = jest.fn(() => ({ single: mockSingle }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ select: mockSelect });

            await expect(getContactById(id)).rejects.toThrow('Erro ao buscar contato');
        });
    });

    // =========================
    // ADD CONTACT
    // =========================
    describe('adiciona contato', () => {
        test('deve inserir o contato e retornar o contato salvo', async () => {
            const fakeContact = {
                nome: 'Maria',
                email: 'maria@email.com',
                telefone: '11999999999',
            };

            // Configura a cadeia completa de métodos do Supabase
            const mockSelect = jest.fn().mockResolvedValue({
                data: [fakeContact],
                error: null,
            });

            const mockInsert = jest.fn().mockReturnValue({
                select: mockSelect
            });

            supabase.from.mockReturnValue({
                insert: mockInsert
            });

            const result = await addContact(fakeContact);

            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockInsert).toHaveBeenCalledWith([{
                ...fakeContact,
                telefone: '11999999999' // telefone já formatado (sem caracteres não numéricos)
            }]);
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(result).toEqual(fakeContact);
        });

        test('deve lançar erro se o Supabase retornar erro', async () => {
            const fakeContact = {
                nome: 'João',
                email: 'joao@email.com',
                telefone: '11999999998',
            };

            // Configura a cadeia completa com erro
            const mockSelect = jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Erro ao inserir'),
            });

            const mockInsert = jest.fn().mockReturnValue({
                select: mockSelect
            });

            supabase.from.mockReturnValue({
                insert: mockInsert
            });

            await expect(addContact(fakeContact)).rejects.toThrow('Erro ao inserir');

            // Verifica se a cadeia de métodos foi chamada corretamente
            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockInsert).toHaveBeenCalledWith([{
                ...fakeContact,
                telefone: '11999999998'
            }]);
            expect(mockSelect).toHaveBeenCalledWith('*');
        });
    });

    // =========================
    // UPDATE CONTACT
    // =========================
    describe('updateContact', () => {
        test('deve atualizar o contato corretamente', async () => {
            const id = 1;
            const contact = {
                nome: 'Maria Silva',
                email: 'maria@email.com',
                telefone: '(11) 9 9999-9999'
            };

            // Mock da chain do Supabase: from().update().eq()
            const mockEq = jest.fn().mockResolvedValue({ error: null });
            const mockUpdate = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ update: mockUpdate });

            await updateContact(id, contact);

            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockUpdate).toHaveBeenCalledWith({
                ...contact,
                telefone: '11999999999'
            });
            expect(mockEq).toHaveBeenCalledWith('id', id);
        });

        test('deve lançar erro se o Supabase retornar erro', async () => {
            const id = 2;
            const contact = {
                nome: 'João Souza',
                email: 'joao@email.com',
                telefone: '22999999999'
            };

            const fakeError = new Error('Erro ao atualizar');
            const mockEq = jest.fn().mockResolvedValue({ error: fakeError });
            const mockUpdate = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ update: mockUpdate });

            await expect(updateContact(id, contact)).rejects.toThrow('Erro ao atualizar');
        });
    });

    // =========================
    // DELETE CONTACT
    // =========================
    describe('deleteContact', () => {
        test('deve deletar o contato corretamente', async () => {
            const id = 1;

            const mockEq = jest.fn().mockResolvedValue({ error: null });
            const mockDelete = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ delete: mockDelete });

            await deleteContact(id);

            expect(supabase.from).toHaveBeenCalledWith('contatos');
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith('id', id);
        });

        test('deve lançar erro se o Supabase retornar erro', async () => {
            const fakeError = new Error('Erro ao deletar');

            const mockEq = jest.fn().mockResolvedValue({ error: fakeError });
            const mockDelete = jest.fn(() => ({ eq: mockEq }));
            supabase.from.mockReturnValue({ delete: mockDelete });

            await expect(deleteContact(1)).rejects.toThrow('Erro ao deletar');
        });
    });
});