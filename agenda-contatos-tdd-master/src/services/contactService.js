import { supabase } from './supabase';

export const getContacts = async () => {
  const { data, error } = await supabase.from('contatos').select('*');
  if (error) throw error;
  return data;
};

export const getContactById = async (id) => {
  const { data, error } = await supabase
    .from('contatos')
    .select('*')
    .eq('id', id)
    .single(); // garante que retorna só um objeto

  if (error) throw error;
  return data;
};

export const addContact = async (contact) => {
  const formattedContact = {
    ...contact,
    telefone: contact.telefone.replace(/\D/g, '') // remove tudo que não é número
  };
  const { data, error } = await supabase.from('contatos').insert([formattedContact]).select('*'); //.select para retornar dado inserido

  if (error) throw error;
  return data[0];
};

export const deleteContact = async (id) => {
  const { error } = await supabase.from('contatos').delete().eq('id', id);
  if (error) throw error;
};

export const updateContact = async (id, contact) => {
  // Remove formatação do telefone antes de enviar
  const contactToUpdate = {
    ...contact,
    telefone: contact.telefone.replace(/\D/g, '')
  };

  const { error } = await supabase.from('contatos').update(contactToUpdate).eq('id', id);
  if (error) throw error;
};
