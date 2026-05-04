import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const GerenciarModelos = () => {
    const [modelos, setModelos] = useState([]);
    const [novoNome, setNovoNome] = useState("");

    useEffect(() => { carregarModelos(); }, []);

    const carregarModelos = async () => {
        const res = await axios.get('http://localhost:8080/api/modelos');
        setModelos(res.data);
    };

    const salvar = async () => {
        if (!novoNome) return;
        try {
            await axios.post('http://localhost:8080/api/modelos', { nome: novoNome });
            setNovoNome("");
            carregarModelos();
        } catch (err) {
            alert("Erro ou modelo já existente.");
        }
    };

    const excluir = async (id) => {
        if (window.confirm("Excluir este modelo?")) {
            await axios.delete(`http://localhost:8080/api/modelos/${id}`);
            carregarModelos();
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }} className="card">
            <h3>⚙️ Gerenciar Modelos de Equipamentos</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    style={{ flex: 1 }}
                    placeholder="Nome do Modelo (Ex: ONU ZTE)" 
                    value={novoNome} 
                    onChange={e => setNovoNome(e.target.value.toUpperCase())} 
                />
                <button onClick={salvar} className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Plus size={18} /> Adicionar
                </button>
            </div>

            <table width="100%">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th style={{ textAlign: 'right' }}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {modelos.map(m => (
                        <tr key={m.id}>
                            <td>{m.nome}</td>
                            <td style={{ textAlign: 'right' }}>
                                <button onClick={() => excluir(m.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GerenciarModelos;