import { fireEvent, render, screen } from '@testing-library/react';
import ContactForm from '../components/ContactForm';

test('renderiza inputs de nome, email e telefone', () => {
  render(<ContactForm />);

  expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
});

test('chama onSubmit com dados corretos', () => {
  const handleSubmit = jest.fn();
  render(<ContactForm onSubmit={handleSubmit} />);

  fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@email.com' } });
  fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 9 9999-9999' } });

  fireEvent.submit(screen.getByRole('form'));

  expect(handleSubmit).toHaveBeenCalledWith({
    nome: 'Ana',
    email: 'ana@email.com',
    telefone: '(11) 9 9999-9999'
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

test('valida que os campos obrigatórios foram preenchidos', () => {
  const handleSubmit = jest.fn();
  render(<ContactForm onSubmit={handleSubmit} />);

  fireEvent.submit(screen.getByRole('form'));

  expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
  expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
  expect(screen.getByText(/telefone é obrigatório/i)).toBeInTheDocument();
  expect(handleSubmit).not.toHaveBeenCalled();
});
