'use client'

import { useState, useEffect } from 'react'

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
    <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'20px', alignItems:'flex-end' }}>
      {/* Status */}
      <div>
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding:'5px', borderRadius:'6px', border:'1px solid #ccc', minWidth:'120px' }}
        >
          {['Todos','Pendente','Pago'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Categoria */}
      <div>
        <label>Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ padding:'5px', borderRadius:'6px', border:'1px solid #ccc', minWidth:'140px' }}
        >
          <option value="Todos">Todos</option>
          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Data início */}
      <div>
        <label>De</label>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          style={{ padding:'5px', borderRadius:'6px', border:'1px solid #ccc' }}
        />
      </div>

      {/* Data fim */}
      <div>
        <label>Até</label>
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          style={{ padding:'5px', borderRadius:'6px', border:'1px solid #ccc' }}
        />
      </div>

      {/* Busca */}
      <div>
        <label>Descrição</label>
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ padding:'5px', borderRadius:'6px', border:'1px solid #ccc', minWidth:'140px' }}
        />
      </div>

      {/* Botões */}
      <div style={{ display:'flex', gap:'10px' }}>
        <button
          onClick={handleApply}
          style={{ padding:'6px 12px', borderRadius:'6px', border:'none', backgroundColor:'#10b981', color:'#fff', cursor:'pointer' }}
        >
          Aplicar
        </button>
        <button
          onClick={handleClear}
          style={{ padding:'6px 12px', borderRadius:'6px', border:'none', backgroundColor:'#64748b', color:'#fff', cursor:'pointer' }}
        >
          Limpar
        </button>
      </div>
    </div>
  )
}
