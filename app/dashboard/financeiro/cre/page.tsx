'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ModalNovaContaReceber from '@/components/ModalNovaContaReceber'
import ModalReceberConta from '@/components/ModalReceberConta'
import FiltrosContas from '@/components/FiltroContas'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Conta = {
  id: string
  descricao: string
  categoria: string
  data_vencimento: string
  valor: number
  status: string
  observacoes: string | null
}

export default function ContasAReceberPage() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showReceberModal, setShowReceberModal] = useState(false)
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null)

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    status: 'Todos',
    categoria: 'Todos',
    dataInicio: '',
    dataFim: '',
    busca: ''
  })

  const categorias = Array.from(new Set(contas.map(c => c.categoria)))

  const fetchContas = async (filtros = filtrosAtivos) => {
    setLoading(true)

    let query = supabase.from('contas_a_receber').select('*').order('data_vencimento', { ascending: true })

    if (filtros.status !== 'Todos') query = query.eq('status', filtros.status)
    if (filtros.categoria !== 'Todos') query = query.eq('categoria', filtros.categoria)
    if (filtros.dataInicio) query = query.gte('data_vencimento', filtros.dataInicio)
    if (filtros.dataFim) query = query.lte('data_vencimento', filtros.dataFim)
    if (filtros.busca) query = query.ilike('descricao', `%${filtros.busca}%`)

    const { data, error } = await query
    if (error) console.error(error)
    else setContas(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchContas()
  }, [])

  const deleteConta = async (id: string) => {
    const { error } = await supabase.from('contas_a_receber').delete().eq('id', id)
    if (error) console.error(error)
    else fetchContas()
  }

  const handleReceber = (conta: Conta) => {
    setSelectedConta(conta)
    setShowReceberModal(true)
  }

  const formatarDataBR = (data: string) => {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }
  

  return (
    <div style={{ padding:'20px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', marginBottom:'10px' }}>Contas a Receber</h1>

      <FiltrosContas
        categorias={categorias}
        onApply={(filtros) => {
          setFiltrosAtivos(filtros)
          fetchContas(filtros)
        }}
        onClear={() => {
          const filtrosLimpos = { status:'Todos', categoria:'Todos', dataInicio:'', dataFim:'', busca:'' }
          setFiltrosAtivos(filtrosLimpos)
          fetchContas(filtrosLimpos)
        }}
      />

      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Nova Conta
        </button>
        <button
          onClick={() => fetchContas(filtrosAtivos)}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#64748b', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Descrição','Categoria','Data Vencimento','Valor','Status','Ações'].map(col => (
                  <th key={col} style={{ borderBottom:'2px solid #ccc', padding:'10px', textAlign:'left', background:'#f3f4f6' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contas.map(conta => (
                <tr key={conta.id} style={{ borderBottom:'1px solid #ddd' }}>
                  <td style={{ padding:'8px' }}>{conta.descricao}</td>
                  <td style={{ padding:'8px' }}>{conta.categoria}</td>
                  <td style={{ padding: '8px' }}>
                    {conta.data_vencimento ? formatarDataBR(conta.data_vencimento) : '-'}
                  </td>
                  <td style={{ padding:'8px' }}>R$ {conta.valor.toFixed(2)}</td>
                  <td
                    style={{
                      padding:'8px',
                      fontWeight:'bold',
                      borderRadius:'6px',
                      backgroundColor: conta.status === 'Pendente' ? '#FFA500' : '#10b981',
                      color:'#fff',
                      textAlign:'center'
                    }}
                  >
                    {conta.status.toUpperCase()}
                  </td>
                  <td style={{ padding:'8px' }}>
                    {conta.status === 'Pendente' && (
                      <button
                        onClick={() => handleReceber(conta)}
                        style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#10b981', color:'#fff', border:'none', cursor:'pointer', marginRight:'5px' }}
                      >
                        Receber
                      </button>
                    )}
                    <button
                      onClick={() => deleteConta(conta.id)}
                      style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#f87171', color:'#fff', border:'none', cursor:'pointer' }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ModalNovaContaReceber
          supabase={supabase}
          onClose={() => setShowModal(false)}
          onSaved={() => fetchContas(filtrosAtivos)}
        />
      )}

      {showReceberModal && selectedConta && (
        <ModalReceberConta
          supabase={supabase}
          conta={selectedConta}
          onClose={() => setShowReceberModal(false)}
          onSaved={() => fetchContas(filtrosAtivos)}
        />
      )}

    </div>
  )
}
