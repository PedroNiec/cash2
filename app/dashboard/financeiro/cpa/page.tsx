'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ModalNovaConta from '@/components/ModalNovaConta'
import ModalPagarConta from '@/components/ModalPagarConta'  
import FiltrosContas from '@/components/FiltroContas'
import { Plus, RefreshCw, Trash2, CheckCircle, Filter, X, DollarSign, Calendar, Tag } from 'lucide-react'

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
  const [showFiltros, setShowFiltros] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  
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
    let query = supabase.from('contas_a_pagar').select('*').order('data_vencimento', { ascending: true })

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
    const { error } = await supabase.from('contas_a_pagar').delete().eq('id', id)
    if (error) console.error(error)
    else fetchContas()
  }

  const handlePagar = (conta: Conta) => {
    setSelectedConta(conta)
    setShowReceberModal(true)
  }

  const formatarDataBR = (data: string) => {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <DollarSign size={40} style={{ color: '#10b981' }} />
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#fff',
            margin: 0
          }}>
            Contas a Pagar
          </h1>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
          Gerencie suas despesas de forma eficiente
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setHoveredButton('nova')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: hoveredButton === 'nova' 
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: hoveredButton === 'nova' 
              ? '0 10px 30px rgba(16, 185, 129, 0.4)'
              : '0 4px 15px rgba(16, 185, 129, 0.3)',
            transform: hoveredButton === 'nova' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={20} />
          Nova Conta
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
          onClick={() => fetchContas(filtrosAtivos)}
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
          <RefreshCw size={20} className={loading ? 'spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Filtros Panel */}
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
        </div>
      )}

      {/* Table Container */}
      <div style={{
        background: 'rgba(31, 41, 55, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 0'
          }}>
            <div className="spin" style={{
              width: '48px',
              height: '48px',
              border: '4px solid #10b981',
              borderTopColor: 'transparent',
              borderRadius: '50%'
            }} />
          </div>
        ) : contas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <DollarSign size={64} style={{ 
              color: '#4b5563', 
              margin: '0 auto 16px' 
            }} />
            <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
              Nenhuma conta encontrada
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                  background: 'rgba(17, 24, 39, 0.8)',
                  borderBottom: '1px solid rgba(75, 85, 99, 0.5)'
                }}>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Descrição
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} />
                      Categoria
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Vencimento
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarSign size={16} />
                      Valor
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {contas.map((conta, index) => (
                  <tr 
                    key={conta.id}
                    onMouseEnter={() => setHoveredRow(conta.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="fade-in"
                    style={{
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                      background: hoveredRow === conta.id ? 'rgba(55, 65, 81, 0.3)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <td style={{
                      padding: '16px 24px',
                      color: '#e5e7eb',
                      fontWeight: '500'
                    }}>
                      {conta.descricao}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        {conta.categoria}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: '#d1d5db'
                    }}>
                      {conta.data_vencimento ? formatarDataBR(conta.data_vencimento) : '-'}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      color: '#10b981',
                      fontWeight: '600',
                      fontSize: '1.05rem'
                    }}>
                      R$ {conta.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        background: conta.status === 'Pendente' 
                          ? 'rgba(245, 158, 11, 0.2)' 
                          : 'rgba(16, 185, 129, 0.2)',
                        color: conta.status === 'Pendente' ? '#fbbf24' : '#10b981',
                        border: conta.status === 'Pendente' 
                          ? '1px solid rgba(245, 158, 11, 0.3)' 
                          : '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {conta.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        {conta.status === 'Pendente' && (
                          <button
                            onClick={() => handlePagar(conta)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '8px 12px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '8px',
                              fontWeight: '500',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <CheckCircle size={16} />
                            Pagar
                          </button>
                        )}
                        <button
                          onClick={() => deleteConta(conta.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
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