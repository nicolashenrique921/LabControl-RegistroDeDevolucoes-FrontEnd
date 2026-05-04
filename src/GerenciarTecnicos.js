import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, UserPlus } from 'lucide-react';

const GerenciarTecnicos = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [novoNome, setNovoNome] = useState("");

    useEffect(() => { carregarTecnicos(); }, []);

    const carregarTecnicos = async () => {
        const res = await axios.get('http://localhost:8080/api/tecnicos');
        setTecnicos(res.data);
    };

    const salvar = async () => {
        if (!novoNome) return;
        try {
            await axios.post('http://localhost:8080/api/tecnicos', { nome: novoNome });
            setNovoNome("");
            carregarTecnicos();
        } catch (err) {
            alert("Erro ou técnico já cadastrado.");
        }
    };

    const excluir = async (id) => {
        if (window.confirm("Remover este técnico do sistema?")) {
            await axios.delete(`http://localhost:8080/api/tecnicos/${id}`);
            carregarTecnicos();
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }} className="card">
            <h3>👥 Gerenciar Equipe Técnica</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    style={{ flex: 1 }}
                    placeholder="Nome Completo do Técnico" 
                    value={novoNome} 
                    onChange={e => setNovoNome(e.target.value.toUpperCase())} 
                />
                <button onClick={salvar} className="btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <UserPlus size={18} /> Cadastrar
                </button>
            </div>

            <table width="100%">
                <thead>
                    <tr>
                        <th>Técnico</th>
                        <th style={{ textAlign: 'right' }}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {tecnicos.map(t => (
                        <tr key={t.id}>
                            <td>{t.nome}</td>
                            <td style={{ textAlign: 'right' }}>
                                <button onClick={() => excluir(t.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
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

export default GerenciarTecnicos;