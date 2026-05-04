import React, { useState } from 'react';
import axios from 'axios';
import { Search, FileSpreadsheet, Printer, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Dashboard from './Dashboard';
import MySwal from './utils/SwalCustom';

const ListaDevolucoes = () => {
  const [filtros, setFiltros] = useState({ mac: '', tecnico: '', os: '', modelo: '', inicio: '', fim: '' });
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  const getNivelReincidencia = (mac) => {
    if (!mac) return 0;
    return resultados.filter(item => item.mac === mac).length;
  };

  const buscar = async (silencioso = false) => {
    try {
      const res = await axios.get('http://localhost:8080/api/devolucoes/buscar', {
        params: filtros
      });
      setResultados(res.data);

      if (filtros.mac && res.data.length >= 2 && !silencioso) {
        MySwal.fire({
          icon: 'warning',
          title: 'Atenção: Equipamento Reincidente',
          html: `O MAC <b>${filtros.mac}</b> já possui <b>${res.data.length} entradas</b> no sistema.`,
          confirmButtonColor: '#e74c3c'
        });
      }

      if (res.data.length === 0 && !silencioso) {
        MySwal.fire({
          icon: 'info',
          title: 'Nenhum resultado',
          text: 'Não encontramos registros com esses filtros.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      if (!silencioso) {
        MySwal.fire({
          icon: 'error',
          title: 'Erro na busca',
          text: 'Verifique se o Backend e o MySQL estão rodando.'
        });
      }
    }
  };

  const prepararEdicao = (item) => {
    navigate('/', { state: { equipamentoParaEditar: item } });
  };

  const excluirRegistro = async (id) => {
    MySwal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não poderá ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/devolucoes/${id}`);
          await MySwal.fire({ icon: 'success', title: 'Excluído!', timer: 1500, showConfirmButton: false });
          buscar(true);
        } catch (err) {
          MySwal.fire({ icon: 'error', title: 'Erro ao excluir' });
        }
      }
    });
  };

  const exportarExcel = () => {
    const dadosFormatados = resultados.map(item => ({
      Data: item.dataDevolucao,
      MAC: item.mac,
      Técnico: item.tecnicoResponsavel,
      OS: item.os,
      Modelo: item.modeloEquipamento
    }));
    const ws = XLSX.utils.json_to_sheet(dadosFormatados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devoluções");
    XLSX.writeFile(wb, `Relatorio_Devolucoes.xlsx`);
  };

  return (
    <div className="container-consulta" style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h2 className="no-print">Consulta de Devoluções</h2>

      <div className="no-print" style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px',
        marginBottom: '20px', background: '#f8f9fa',
        padding: '15px', borderRadius: '8px', border: '1px solid #eee'
      }}>
        <input
          placeholder="MAC / Identificação"
          value={filtros.mac}
          onChange={(e) => setFiltros({ ...filtros, mac: e.target.value.toUpperCase() })}
          style={{ flex: '1 1 150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          placeholder="Técnico"
          value={filtros.tecnico}
          onChange={(e) => setFiltros({ ...filtros, tecnico: e.target.value })}
          style={{ flex: '1 1 150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          placeholder="O.S."
          value={filtros.os}
          onChange={(e) => setFiltros({ ...filtros, os: e.target.value })}
          style={{ flex: '1 1 100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          placeholder="Equipamento / Modelo"
          value={filtros.modelo}
          onChange={(e) => setFiltros({ ...filtros, modelo: e.target.value })}
          style={{ flex: '1 1 150px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>De:</label>
          <input
            type="date"
            value={filtros.inicio}
            onChange={(e) => setFiltros({ ...filtros, inicio: e.target.value })}
            style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Até:</label>
          <input
            type="date"
            value={filtros.fim}
            onChange={(e) => setFiltros({ ...filtros, fim: e.target.value })}
            style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button onClick={() => buscar(false)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Search size={18} /> Buscar
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px' }}>
          <button onClick={exportarExcel} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={() => window.print()} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <Printer size={16} /> Imprimir/PDF
          </button>
        </div>
      )}

      {resultados.length > 0 && <Dashboard dados={resultados} />}

      <div className="tabela-container" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f2f2f2' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Data</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>MAC / Identificação</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Técnico</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>O.S.</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Modelo</th>
              <th className="no-print" style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((item) => {
              const ocorrencias = getNivelReincidencia(item.mac);
              const reincidente = ocorrencias >= 2;
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee', backgroundColor: reincidente ? '#fff5f5' : 'transparent' }}>
                  <td style={{ padding: '12px' }}>{item.dataDevolucao}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#2980b9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.mac || 'N/A'}
                      {reincidente && (
                        <span style={{ background: '#e74c3c', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {ocorrencias}x RETORNO
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>{item.tecnicoResponsavel}</td>
                  <td style={{ padding: '12px' }}>{item.os || '---'}</td>
                  <td style={{ padding: '12px' }}>{item.modeloEquipamento}</td>
                  <td className="no-print" style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => prepararEdicao(item)} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px' }}><Edit size={18} /></button>
                    <button onClick={() => excluirRegistro(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaDevolucoes;