'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Eye, CheckCircle, Filter, X, Calendar, DollarSign, TrendingUp, Award } from 'lucide-react'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

interface Fechamento {
  id: string
  data: string
  m1_lucro: number
  m1_ops: number
  m2_lucro: number
  m2_ops: number
  m3_lucro: number
  m3_ops: number
  total_dia: number
  pct_meta: number
  delta_meta: number
  status_dia: string
  observacoes: string | null
  reconciled_cash: number | null
  attachments: any[]
  provisioned: boolean
}

interface FechamentosGridProps {
  onView: (fechamento: Fechamento) => void
  refresh?: number
}

export default function FechamentosGrid({ onView, refresh }: FechamentosGridProps) {
  const [fechamentos, setFechamentos] = useState<Fechamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING_APPROVAL' | 'APPROVED'>('ALL')
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const fetchFechamentos = async () => {
    setLoading(true)
    try {
      let query = supabase.from('fechamento_dia').select('*').order('data', { ascending: false })

      if (filter === 'PENDING_APPROVAL') {
        query = query.eq('status_dia', 'PENDING_APPROVAL')
      } else if (filter === 'APPROVED') {
        query = query.eq('status_dia', 'APPROVED')
      }

      const { data, error } = await query

      console.log(error);

      if (error) {
        console.error('Erro ao buscar fechamentos:', error)
      } else {
        setFechamentos(data || [])
      }
    } catch (err) {
      console.error('Erro ao buscar fechamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFechamentos()
  }, [filter, refresh])

  const handleApprove = async (id: string) => {
    setConfirmApproveId(null)

    try {
      const { error } = await supabase
        .from('fechamento_dia')
        .update({ status: 'APPROVED' })
        .eq('id', id)

      if (error) {
        alert('Erro ao aprovar fechamento: ' + error.message)
      } else {
        fetchFechamentos()
      }
    } catch (err) {
      alert('Erro inesperado ao aprovar fechamento')
      console.error(err)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_APPROVAL: {
        bg: 'rgba(245, 158, 11, 0.2)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        text: 'Pendente'
      },
      APPROVED: {
        bg: 'rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        text: 'Aprovado'
      },
      REJECTED: {
        bg: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        text: 'Rejeitado'
      }
    }
    const style = styles[status as keyof typeof styles] || styles.PENDING_APPROVAL
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        background: style.bg,
        color: style.color,
        border: style.border
      }}>
        {style.text}
      </span>
    )
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('ALL')}
          onMouseEnter={() => setHoveredButton('todos')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: filter === 'ALL'
              ? (hoveredButton === 'todos' 
                  ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)')
              : (hoveredButton === 'todos' ? '#374151' : '#4b5563'),
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: filter === 'ALL'
              ? (hoveredButton === 'todos' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)')
              : (hoveredButton === 'todos' ? '0 4px 15px rgba(75, 85, 99, 0.4)' : '0 2px 8px rgba(75, 85, 99, 0.2)'),
            transform: hoveredButton === 'todos' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Filter size={20} />
          Todos
        </button>

        <button
          onClick={() => setFilter('PENDING_APPROVAL')}
          onMouseEnter={() => setHoveredButton('pendente')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: filter === 'PENDING_APPROVAL'
              ? (hoveredButton === 'pendente' 
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)')
              : (hoveredButton === 'pendente' ?'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'),
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: filter === 'PENDING_APPROVAL'
              ? (hoveredButton === 'pendente' ? '0 10px 30px rgba(251, 191, 36, 0.5)' : '0 4px 15px rgba(251, 191, 36, 0.3)')
              : (hoveredButton === 'pendente' ? '0 4px 15px rgba(75, 85, 99, 0.4)' : '0 2px 8px rgba(75, 85, 99, 0.2)'),
            transform: hoveredButton === 'pendente' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <X size={20} />
          Pendentes
        </button>

        <button
          onClick={() => setFilter('APPROVED')}
          onMouseEnter={() => setHoveredButton('aprovado')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: filter === 'APPROVED'
              ? (hoveredButton === 'aprovado' 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)')
              : (hoveredButton === 'aprovado' ? '#366b50ff' : '#0e4d2dff'),
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: filter === 'APPROVED'
              ? (hoveredButton === 'aprovado' ? '0 10px 30px rgba(16, 185, 129, 0.5)' : '0 4px 15px rgba(16, 185, 129, 0.3)')
              : (hoveredButton === 'aprovado' ? '0 4px 15px rgba(54, 95, 71, 0.4)' : '0 2px 8px rgba(56, 119, 88, 0.2)'),
            transform: hoveredButton === 'aprovado' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <CheckCircle size={20} />
          Aprovados
        </button>
      </div>

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
              border: '4px solid #8b5cf6',
              borderTopColor: 'transparent',
              borderRadius: '50%'
            }} />
          </div>
        ) : fechamentos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <TrendingUp size={64} style={{ 
              color: '#4b5563', 
              margin: '0 auto 16px' 
            }} />
            <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
              Nenhum fechamento encontrado
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Data
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <DollarSign size={16} />
                      Total Dia
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <Award size={16} />
                      % Meta
                    </div>
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#d1d5db',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <TrendingUp size={16} />
                      Delta
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
                    Anexos
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
                {fechamentos.map((f, index) => (
                  <tr 
                    key={f.id}
                    onMouseEnter={() => setHoveredRow(f.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="fade-in"
                    style={{
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                      background: hoveredRow === f.id ? 'rgba(55, 65, 81, 0.3)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <td style={{
                      padding: '16px 24px',
                      color: '#e5e7eb',
                      fontWeight: '500'
                    }}>
                      {formatDate(f.data)}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'right',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      color: f.total_dia >= 0 ? '#10b981' : '#f87171'
                    }}>
                      {formatCurrency(f.total_dia)}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'right',
                      color: '#d1d5db'
                    }}>
                      {f.pct_meta.toFixed(1)}%
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'right',
                      color: f.delta_meta >= 0 ? '#10b981' : '#f87171'
                    }}>
                      {formatCurrency(f.delta_meta)}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      {getStatusBadge(f.status_dia)}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      textAlign: 'center',
                      color: '#9ca3af'
                    }}>
                      {f.attachments?.length || 0}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => onView(f)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={16} />
                          Ver
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

      {/* Modal de Confirmação */}
      {confirmApproveId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: 'rgba(31, 41, 55, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#fff'
            }}>
              Confirmar Aprovação
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              Confirmar aprovação? Isso tornará o registro imutável e bloqueará uploads adicionais.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmApproveId(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#374151'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4b5563'
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#4b5563',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleApprove(confirmApproveId)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}