"use client";

import React, { useState } from "react";
import PlanejamentoGrid from "../../../components/PlanejamentoGrid";
import PlanejamentoModal from "../../../components/PlanejamentoModal";
import { Plus, Calendar, Filter, X, RefreshCw } from 'lucide-react';

export default function TarefasPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlanejamento, setSelectedPlanejamento] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showFiltros, setShowFiltros] = useState(false);
  
  const [filtros, setFiltros] = useState({
    status: 'Todos',
    dataInicio: '',
    dataFim: '',
    busca: ''
  });

  const handleOpenNew = () => {
    setSelectedPlanejamento(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (planejamentoId: string) => {
    setSelectedPlanejamento(planejamentoId);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedPlanejamento(null);
  };

  const handleSaved = () => {
    setOpenModal(false);
    setSelectedPlanejamento(null);
    setReload((r) => !r);
  };

  const handleApplyFiltros = () => {
    setReload((r) => !r);
  };

  const handleClearFiltros = () => {
    setFiltros({
      status: 'Todos',
      dataInicio: '',
      dataFim: '',
      busca: ''
    });
    setReload((r) => !r);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
      `}</style>

      <div style={{ marginBottom: '32px' }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Calendar size={40} style={{ color: '#8b5cf6' }} />
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#fff',
            margin: 0
          }}>
            Planejamentos
          </h1>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
          Organize suas tarefas e planejamentos do dia
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={handleOpenNew}
          onMouseEnter={() => setHoveredButton('novo')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: hoveredButton === 'novo' 
              ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: hoveredButton === 'novo' 
              ? '0 10px 30px rgba(139, 92, 246, 0.4)'
              : '0 4px 15px rgba(139, 92, 246, 0.3)',
            transform: hoveredButton === 'novo' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={20} />
          Novo Planejamento
        </button>

        <button
          onClick={() => setShowFiltros(!showFiltros)}
          onMouseEnter={() => setHoveredButton('filtros')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: showFiltros 
              ? (hoveredButton === 'filtros' 
                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)')
              : (hoveredButton === 'filtros' ? '#374151' : '#4b5563'),
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: showFiltros 
              ? (hoveredButton === 'filtros' ? '0 10px 30px rgba(139, 92, 246, 0.5)' : '0 4px 15px rgba(139, 92, 246, 0.3)')
              : (hoveredButton === 'filtros' ? '0 4px 15px rgba(75, 85, 99, 0.4)' : '0 2px 8px rgba(75, 85, 99, 0.2)'),
            transform: hoveredButton === 'filtros' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          {showFiltros ? <X size={20} /> : <Filter size={20} />}
          Filtros
        </button>

        <button
          onClick={() => setReload(r => !r)}
          onMouseEnter={() => setHoveredButton('atualizar')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: hoveredButton === 'atualizar' ? '#374151' : '#4b5563',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: hoveredButton === 'atualizar' 
              ? '0 4px 15px rgba(75, 85, 99, 0.4)'
              : '0 2px 8px rgba(75, 85, 99, 0.2)',
            transform: hoveredButton === 'atualizar' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <RefreshCw size={20} />
          Atualizar
        </button>
      </div>

      {showFiltros && (
        <div className="slide-down" style={{
          marginBottom: '24px',
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <h3 style={{ 
            color: '#e5e7eb', 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '16px' 
          }}>
            Filtros
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Todos">Todos</option>
                <option value="TODO">A Fazer</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '6px' }}>
                Data Início
              </label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '6px' }}>
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#d1d5db', marginBottom: '6px' }}>
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleApplyFiltros}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFiltros}
              style={{
                padding: '10px 20px',
                background: '#4b5563',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      <PlanejamentoGrid reload={reload} onEdit={handleOpenEdit} filtros={filtros} />

      <PlanejamentoModal
        open={openModal}
        planejamentoId={selectedPlanejamento}
        onClose={handleClose}
        onSaved={handleSaved}
      />
    </div>
  );
}