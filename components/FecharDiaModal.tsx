'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Calendar, DollarSign, TrendingUp, Award, AlertCircle, X } from 'lucide-react'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

interface FecharDiaModalProps {
  show: boolean
  onClose: () => void
  onSave: () => void
}

export default function FecharDiaModal({ show, onClose, onSave }: FecharDiaModalProps) {
  const [form, setForm] = useState({
    data: new Date().toISOString().slice(0, 10),
    m1_lucro: '',
    m1_ops: '',
    m2_lucro: '',
    m2_ops: '',
    m3_lucro: '',
    m3_ops: '',
    reconciled_cash: '',
    observacoes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  // Calcular preview dos totais
  const m1 = parseFloat(form.m1_lucro) || 0
  const m2 = parseFloat(form.m2_lucro) || 0
  const m3 = parseFloat(form.m3_lucro) || 0
  const totalDia = m1 + m2 + m3
  const pctMeta = (totalDia / 400) * 100
  const deltaMeta = totalDia - 400

  const resetForm = () => {
    setForm({
      data: new Date().toISOString().slice(0, 10),
      m1_lucro: '',
      m1_ops: '',
      m2_lucro: '',
      m2_ops: '',
      m3_lucro: '',
      m3_ops: '',
      reconciled_cash: '',
      observacoes: '',
    })
    setError('')
  }

  const validateForm = () => {
    if (!form.data) {
      setError('Data é obrigatória')
      return false
    }

    // Validar ops são inteiros >= 0
    const ops = [form.m1_ops, form.m2_ops, form.m3_ops]
    for (const op of ops) {
      if (op && (parseInt(op) < 0 || !Number.isInteger(parseFloat(op)))) {
        setError('Operações devem ser números inteiros >= 0')
        return false
      }
    }

    return true
  }

  const handleSave = async () => {
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // Validar se já existe APPROVED ou PENDING_APPROVAL para a mesma data
      const { data: existing, error: checkError } = await supabase
        .from('fechamento_dia')
        .select('id, status_dia')
        .eq('data', form.data)

      if (checkError) {
        setError('Erro ao verificar fechamentos existentes')
        setLoading(false)
        return
      }

      if (existing && existing.length > 0) {
        const hasApproved = existing.some(f => f.status_dia === 'APPROVED')
        const hasPending = existing.some(f => f.status_dia === 'PENDING_APPROVAL')

        if (hasApproved) {
          setError('Já existe um fechamento aprovado para essa data')
          setLoading(false)
          return
        }

        if (hasPending) {
          setError('Já existe um fechamento pendente para essa data')
          setLoading(false)
          return
        }
      }

      // Preparar payload
      const payload = {
        data: form.data,
        m1_lucro: parseFloat(form.m1_lucro) || 0,
        m1_ops: parseInt(form.m1_ops) || 0,
        m2_lucro: parseFloat(form.m2_lucro) || 0,
        m2_ops: parseInt(form.m2_ops) || 0,
        m3_lucro: parseFloat(form.m3_lucro) || 0,
        m3_ops: parseInt(form.m3_ops) || 0,
        reconciled_cash: form.reconciled_cash ? parseFloat(form.reconciled_cash) : null,
        observacoes: form.observacoes || null,
        total_dia: totalDia,
        pct_meta: pctMeta,
        delta_meta: deltaMeta,
        status_dia: 'PENDING_APPROVAL',
      }

      const { error: insertError } = await supabase
        .from('fechamento_dia')
        .insert([payload])

      if (insertError) {
        setError('Erro ao salvar fechamento: ' + insertError.message)
        setLoading(false)
        return
      }

      resetForm()
      onSave()
    } catch (err) {
      setError('Erro inesperado ao salvar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  if (!show) return null

  return (
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
      padding: '20px',
      zIndex: 100
    }}>
      <div style={{
        background: 'rgba(31, 41, 55, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp size={28} style={{ color: '#8b5cf6' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              Fechar Dia
            </h2>
          </div>
          <button
            onClick={handleCancel}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(75, 85, 99, 0.2)'
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: 'rgba(75, 85, 99, 0.2)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#9ca3af'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '20px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Data */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#d1d5db',
            fontSize: '0.875rem'
          }}>
            <Calendar size={16} />
            Data *
          </label>
          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              background: 'rgba(55, 65, 81, 0.3)',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Método 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              <DollarSign size={16} />
              M1 Lucro *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.m1_lucro}
              onChange={(e) => setForm({ ...form, m1_lucro: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              M1 Operações *
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.m1_ops}
              onChange={(e) => setForm({ ...form, m1_ops: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Método 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              <DollarSign size={16} />
              M2 Lucro *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.m2_lucro}
              onChange={(e) => setForm({ ...form, m2_lucro: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              M2 Operações *
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.m2_ops}
              onChange={(e) => setForm({ ...form, m2_ops: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Método 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              <DollarSign size={16} />
              M3 Lucro *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.m3_lucro}
              onChange={(e) => setForm({ ...form, m3_lucro: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#d1d5db',
              fontSize: '0.875rem'
            }}>
              M3 Operações *
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.m3_ops}
              onChange={(e) => setForm({ ...form, m3_ops: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Caixa Reconciliado */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#d1d5db',
            fontSize: '0.875rem'
          }}>
            <DollarSign size={16} />
            Caixa Reconciliado
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.reconciled_cash}
            onChange={(e) => setForm({ ...form, reconciled_cash: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              background: 'rgba(55, 65, 81, 0.3)',
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Observações */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#d1d5db',
            fontSize: '0.875rem'
          }}>
            Observações
          </label>
          <textarea
            placeholder="Observações sobre o fechamento..."
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              background: 'rgba(55, 65, 81, 0.3)',
              color: '#fff',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Preview dos Cálculos */}
        <div style={{
          padding: '20px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Award size={20} style={{ color: '#a78bfa' }} />
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#a78bfa',
              margin: 0
            }}>
              Preview dos Resultados
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db' }}>Total do Dia:</span>
              <span style={{
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: totalDia >= 0 ? '#10b981' : '#f87171'
              }}>
                R$ {totalDia.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db' }}>% da Meta (R$ 400):</span>
              <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>
                {pctMeta.toFixed(2)}%
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db' }}>Delta da Meta:</span>
              <span style={{
                fontWeight: 'bold',
                color: deltaMeta >= 0 ? '#10b981' : '#f87171'
              }}>
                R$ {deltaMeta.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={handleCancel}
            disabled={loading}
            onMouseEnter={() => !loading && setHoveredButton('cancelar')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: hoveredButton === 'cancelar' ? '#374151' : '#4b5563',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            onMouseEnter={() => !loading && setHoveredButton('salvar')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: hoveredButton === 'salvar'
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: !loading && hoveredButton === 'salvar'
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Fechamento'}
          </button>
        </div>
      </div>
    </div>
  )
}