'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ModalNovaConta from '@/components/ModalNovaConta'
import ModalPagarConta from '@/components/ModalPagarConta'  

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
  forma_pagamento: string | null
  observacoes: string | null
}

export default function ContasAPagarPage() {
  const [contas, setContas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [showReceberModal, setShowReceberModal] = useState(false)
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null)


  const fetchContas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contas_a_pagar')
      .select('*')
      .order('data_vencimento', { ascending: true })
    if (error) console.error(error)
    else setContas(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchContas()
  }, [])

  const deleteConta = async (id: string) => {
    const { error } = await supabase.from('contas_a_pagar').delete().eq('id', id)
    if (error) console.error(error)
    else fetchContas()
  }

  const handlePagar = (conta: Conta) => {
    setSelectedConta(conta)
    setShowReceberModal(true)
  }

  return (
    <div style={{ padding:'20px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', marginBottom:'10px' }}>Contas a Pagar</h1>
  
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Nova Conta
        </button>
        <button
          onClick={fetchContas}
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
                {['Descrição','Categoria','Vencimento','Valor','Status','Ações'].map(col => (
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
                  <td style={{ padding:'8px' }}>{conta.data_vencimento}</td>
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
                        onClick={() => handlePagar(conta)}
                        style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#10b981', color:'#fff', border:'none', cursor:'pointer', marginRight:'5px' }}
                      >
                        Pagar
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
        <ModalNovaConta
          supabase={supabase}
          onClose={() => setShowModal(false)}
          onSaved={fetchContas}
        />
      )}
  
      {showReceberModal && selectedConta && (
        <ModalPagarConta
          supabase={supabase}
          conta={selectedConta}
          onClose={() => setShowReceberModal(false)}
          onSaved={fetchContas}
        />
      )}
  
    </div>
  )
}