import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';
import * as service from '../services/contactService';

// Mock de window.alert
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => { });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('AppRoutes', () => {
  beforeEach(() => {
    // Mock dos serviços
    jest.spyOn(service, 'getContacts').mockResolvedValue([
      { id: 1, nome: 'Fulano', telefone: '(12) 3456-78' },
      { id: 2, nome: 'Beltrano', telefone: '(98) 7654-32' },
    ]);

    jest.spyOn(service, 'getContactById').mockResolvedValue({
      id: 123,
      nome: 'Teste',
      telefone: '(11) 1111-2222',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza HomePage na rota "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
  });

  test('renderiza ContactList na rota "/contatos"', async () => {
    render(
      <MemoryRouter initialEntries={['/contatos']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // título da lista
    expect(await screen.findByText(/lista de contatos/i)).toBeInTheDocument();

    // Fulano deve aparecer 2 vezes (tabela + card)
    const fulanos = await screen.findAllByText(/fulano/i);
    expect(fulanos).toHaveLength(2);

    // Beltrano deve aparecer 2 vezes (tabela + card)
    const beltranos = await screen.findAllByText(/beltrano/i);
    expect(beltranos).toHaveLength(2);
  });

  test('renderiza ContactForm na rota "/novo"', () => {
    render(
      <MemoryRouter initialEntries={['/novo']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  test('renderiza EditContact na rota "/editar/:id"', async () => {
    render(
      <MemoryRouter initialEntries={['/editar/123']}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Espera o título da tela de edição
    expect(await screen.findByText(/editar contato/i)).toBeInTheDocument();

    // Confere se o contato mockado apareceu no form
    expect(await screen.findByDisplayValue(/teste/i)).toBeInTheDocument();
  });
});
