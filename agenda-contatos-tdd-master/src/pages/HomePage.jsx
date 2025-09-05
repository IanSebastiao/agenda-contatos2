const HomePage = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2>Bem-vindo ao Gerenciador de Contatos</h2>
              <div className="mt-4">
                <h3 className="text-muted mb-4">Recursos Disponíveis</h3>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light">
                      <i className="bi bi-people-fill fs-1 text-primary mb-3"></i>
                      <h4>Lista de Contatos</h4>
                      <p className="text-muted">Visualize todos os seus contatos cadastrados</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light">
                      <i className="bi bi-person-plus fs-1 text-success mb-3"></i>
                      <h4>Novo Contato</h4>
                      <p className="text-muted">Adicione novos contatos à sua agenda</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light">
                      <i className="bi bi-pencil-square fs-1 text-warning mb-3"></i>
                      <h4>Edição Fácil</h4>
                      <p className="text-muted">Atualize informações dos seus contatos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;