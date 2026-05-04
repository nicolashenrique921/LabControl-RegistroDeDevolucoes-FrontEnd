import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const Dashboard = ({ dados }) => {
  // Paleta Opção 2: Flat UI
  const COLORS = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6',
    '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d',
    '#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#dfe6e9'
  ];

  const totalEquipamentos = dados.length;

  const modeloMaisFrequente = useMemo(() => {
    if (totalEquipamentos === 0) return "-";
    const contagem = dados.reduce((acc, item) => {
      acc[item.modeloEquipamento] = (acc[item.modeloEquipamento] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(contagem).reduce((a, b) => contagem[a] > contagem[b] ? a : b);
  }, [dados, totalEquipamentos]);

  const totalTecnicos = useMemo(() => new Set(dados.map(d => d.tecnicoResponsavel)).size, [dados]);

  const dadosPizza = useMemo(() => {
    const contagem = dados.reduce((acc, item) => {
      acc[item.modeloEquipamento] = (acc[item.modeloEquipamento] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(contagem).map(key => ({ name: key, value: contagem[key] }));
  }, [dados]);

  const dadosBarras = useMemo(() => {
    const contagem = dados.reduce((acc, item) => {
      acc[item.tecnicoResponsavel] = (acc[item.tecnicoResponsavel] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(contagem).map(key => ({ name: key, devolucoes: contagem[key] }));
  }, [dados]);

  const cardStyle = {
    background: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1,
    minWidth: '150px'
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Cards de Resumo */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h5 style={{ margin: 0, color: '#7f8c8d' }}>TOTAL DEVOLVIDO</h5>
          <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{totalEquipamentos}</p>
        </div>
        <div style={cardStyle}>
          <h5 style={{ margin: 0, color: '#7f8c8d' }}>MODELO MAIS COMUM</h5>
          <p style={{ margin: '10px 0 0', fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>{modeloMaisFrequente}</p>
        </div>
        <div style={cardStyle}>
          <h5 style={{ margin: 0, color: '#7f8c8d' }}>TÉCNICOS ATIVOS</h5>
          <p style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{totalTecnicos}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Gráfico de Pizza */}
        <div style={{ height: '350px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Distribuição por Modelo</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie 
                data={dadosPizza} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label
              >
                {dadosPizza.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} // Uso do % para rotacionar cores
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras */}
        <div style={{ height: '350px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Devoluções por Técnico</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip cursor={{fill: '#f5f5f5'}} />
              <Bar dataKey="devolucoes" name="Total">
                {dadosBarras.map((entry, index) => (
                  <Cell 
                    key={`cell-bar-${index}`} 
                    fill={COLORS[index % COLORS.length]} // Uso do % para cada barra ter uma cor
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;