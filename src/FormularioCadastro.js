import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MySwal from './utils/SwalCustom'; 

const FormularioCadastro = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const itemParaEditar = location.state?.equipamentoParaEditar;

    const initialState = {
        mac: '', os: '', modeloEquipamento: '', tecnicoResponsavel: '',
        dataRetirada: '', dataDevolucao: '', observacoes: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [listaModelos, setListaModelos] = useState([]);
    const [listaTecnicos, setListaTecnicos] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resModelos, resTecnicos] = await Promise.all([
                    axios.get('http://localhost:8080/api/modelos'),
                    axios.get('http://localhost:8080/api/tecnicos')
                ]);
                setListaModelos(resModelos.data);
                setListaTecnicos(resTecnicos.data);
            } catch (err) {
                console.error("Erro ao carregar seletores", err);
            }
        };
        carregarDados();

        if (itemParaEditar) {
            setFormData({
                ...itemParaEditar,
                observacoes: itemParaEditar.observacoes || ''
            });
        }
    }, [itemParaEditar]);

    const enviar = async (e) => {
        e.preventDefault();

        const dadosParaEnviar = { 
            ...formData,
            mac: formData.mac?.trim() === "" ? null : formData.mac?.trim(),
            os: formData.os?.trim() === "" ? null : formData.os?.trim()
        };

        try {
            if (itemParaEditar) {
                // LÓGICA DE ATUALIZAÇÃO
                await axios.put(`http://localhost:8080/api/devolucoes/${itemParaEditar.id}`, dadosParaEnviar);
                
                await MySwal.fire({
                    icon: 'success',
                    title: 'Atualizado!',
                    text: 'O registro foi alterado com sucesso.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Na edição, voltamos para o histórico
                navigate('/consultar', { replace: true });

            } else {
                // LÓGICA DE NOVO REGISTRO
                await axios.post('http://localhost:8080/api/devolucoes', dadosParaEnviar);
                
                await MySwal.fire({
                    icon: 'success',
                    title: 'Registrado!',
                    text: 'Equipamento salvo no sistema.',
                    showConfirmButton: false,
                    timer: 1500
                });

                // LIMPEZA DO FORMULÁRIO (Para continuar na mesma página)
                setFormData(initialState);
                
                // Opcional: Se quiser que o foco volte para o primeiro campo (MAC)
                // você pode usar um ref aqui.
            }
        } catch (err) {
            MySwal.fire({
                icon: 'error',
                title: 'Erro ao salvar',
                text: err.response?.data?.message || "Verifique os dados e tente novamente.",
                confirmButtonColor: '#e74c3c'
            });
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>{itemParaEditar ? 'Editar Registro' : 'Nova Devolução'}</h3>
            <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                <label>MAC (Opcional):</label>
                <input
                    placeholder="Ex: AA:BB:CC..."
                    value={formData.mac || ''}
                    onChange={e => setFormData({ ...formData, mac: e.target.value.toUpperCase() })}
                    disabled={!!itemParaEditar}
                />

                <label>O.S. (Opcional):</label>
                <input 
                    placeholder="Número da Ordem de Serviço" 
                    value={formData.os || ''} 
                    onChange={e => setFormData({ ...formData, os: e.target.value })} 
                />

                <label>Modelo do Equipamento:</label>
                <select
                    value={formData.modeloEquipamento}
                    onChange={e => setFormData({ ...formData, modeloEquipamento: e.target.value })}
                    required
                >
                    <option value="">-- Selecione o Modelo --</option>
                    {listaModelos.map(m => (
                        <option key={m.id} value={m.nome}>{m.nome}</option>
                    ))}
                </select>

                <label>Técnico Responsável:</label>
                <select
                    value={formData.tecnicoResponsavel}
                    onChange={e => setFormData({ ...formData, tecnicoResponsavel: e.target.value })}
                    required
                >
                    <option value="">-- Selecione o Técnico --</option>
                    {listaTecnicos.map(t => (
                        <option key={t.id} value={t.nome}>{t.nome}</option>
                    ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label>Data Retirada:</label>
                        <input type="date" style={{ width: '100%' }} value={formData.dataRetirada} onChange={e => setFormData({ ...formData, dataRetirada: e.target.value })} />
                    </div>
                    <div>
                        <label>Data Devolução:</label>
                        <input type="date" style={{ width: '100%' }} value={formData.dataDevolucao} onChange={e => setFormData({ ...formData, dataDevolucao: e.target.value })} />
                    </div>
                </div>

                <label>Observações:</label>
                <textarea 
                    placeholder="Algum detalhe importante?" 
                    value={formData.observacoes} 
                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })} 
                />

                <button type="submit" style={{ background: itemParaEditar ? '#2980b9' : '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {itemParaEditar ? 'Salvar Alterações' : 'Salvar no Sistema'}
                </button>

                {itemParaEditar && (
                    <button type="button" onClick={() => navigate('/consultar')} style={{ background: '#bdc3c7', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
};

export default FormularioCadastro;