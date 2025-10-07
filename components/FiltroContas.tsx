'use client'

import { useState } from 'react'

interface FiltroProps {
  categorias: string[]
  onApply: (filtros: {
    status: string
    categoria: string
    dataInicio: string
    dataFim: string
    busca: string
  }) => void
  onClear: () => void
}

// Componente auxiliar fora do return
const Campo = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
    <label
      style={{
        marginBottom: '6px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
      }}
    >
      {label}
    </label>
    {children}
  </div>
)

export default function FiltrosContas({ categorias, onApply, onClear }: FiltroProps) {
  const [status, setStatus] = useState('Todos')
  const [categoria, setCategoria] = useState('Todos')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [busca, setBusca] = useState('')

  const handleApply = () => {
    onApply({ status, categoria, dataInicio, dataFim, busca })
  }

  const handleClear = () => {
    setStatus('Todos')
    setCategoria('Todos')
    setDataInicio('')
    setDataFim('')
    setBusca('')
    onClear()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        alignItems: 'flex-end',
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Campo label="Status">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        >
          {['Todos', 'Pendente', 'Pago'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="Categoria">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        >
          <option value="Todos">Todos</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="De">
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        />
      </Campo>

      <Campo label="Até">
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        />
      </Campo>

      <Campo label="Descrição">
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
          }}
        />
      </Campo>

      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
        <button
          onClick={handleApply}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#10b981',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
        >
          Aplicar
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#6b7280',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6b7280')}
        >
          Limpar
        </button>
      </div>
    </div>
  )
}
