import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <i className="bi bi-journal-bookmark-fill me-2"></i>
                    Gerenciador de Contatos
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="bi bi-house-door me-1"></i> Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/contatos"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="bi bi-list-ul me-1"></i> Contatos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/novo"
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="bi bi-person-plus me-1"></i> Novo Contato
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;