import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListaDevolucoes from './ListaDevolucoes';
import FormularioCadastro from './FormularioCadastro';
import GerenciarModelos from './GerenciarModelos';
import GerenciarTecnicos from './GerenciarTecnicos'; // Importe o novo componente
import logo from './logo.png';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Menu de Navegação */}
        <nav className="no-print" style={{ 
          padding: '10px 30px', 
          background: '#2c3e50', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          
          {/* Lado Esquerdo: Logo e Título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={logo} 
              alt="Logo Laboratório" 
              style={{ height: '45px', width: 'auto', borderRadius: '4px' }} 
            />
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#ecf0f1'
            }}>
              Lab Control
            </span>
          </div>

          {/* Lado Direito: Links de Navegação */}
          <div style={{ display: 'flex', gap: '25px' }}>
            <Link to="/registrar" className="nav-link-custom">Novo Registro</Link>
            <Link to="/consultar" className="nav-link-custom">Histórico</Link>
            <Link to="/modelos" className="nav-link-custom">Modelos</Link>
            <Link to="/tecnicos" className="nav-link-custom">Técnicos</Link>
          </div>
        </nav>

        {/* Área de Conteúdo */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<FormularioCadastro />} />
            <Route path="/registrar" element={<FormularioCadastro />} />
            <Route path="/consultar" element={<ListaDevolucoes />} />
            <Route path="/modelos" element={<GerenciarModelos />} />
            <Route path="/tecnicos" element={<GerenciarTecnicos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;