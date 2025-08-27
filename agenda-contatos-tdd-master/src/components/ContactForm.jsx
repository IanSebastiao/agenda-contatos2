import { useState } from 'react';

const ContactForm = ({ contact = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: contact.nome || '',
    email: contact.email || '',
    telefone: contact.telefone || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      setFormData({ ...formData, telefone: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatPhone = (phone) => {
    // Remove tudo que não for número
    const onlyNums = phone.replace(/\D/g, '');

    if (onlyNums.length <= 10) {
      // Telefone fixo (8 dígitos)
      return onlyNums
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Celular (9 dígitos)
      return onlyNums
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form role="form" onSubmit={handleSubmit} className="mt-3 p-3 border rounded">
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
        />
        {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="telefone" className="form-label">Telefone</label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          maxLength="15"
          className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
        />
        {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
      </div>

      <button type="submit" className="btn btn-dark">Salvar</button>
    </form>
  );
};

export default ContactForm;