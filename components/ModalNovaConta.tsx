'use client'

import { useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { X, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react'

interface ModalProps {
  onClose: () => void
  onSaved: () => void
  supabase: SupabaseClient
}

export default function ModalNovaConta({ onClose, onSaved, supabase }: ModalProps) {
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dataVencimento, setDataVencimento] = useState('')
  const [valor, setValor] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!descricao || !categoria || !dataVencimento || !valor) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    const { error } = await supabase.from('contas_a_pagar').insert([
      {
        descricao,
        categoria,
        data_vencimento: dataVencimento,
        valor: parseFloat(valor),
        forma_pagamento: formaPagamento,
        observacoes,
      },
    ])

    if (error) {
      console.error(error)
      alert('Erro ao salvar a conta')
    } else {
      setDescricao('')
      setCategoria('')
      setDataVencimento('')
      setValor('')
      setFormaPagamento('')
      setObservacoes('')
      onSaved()
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          padding: '32px',
          borderRadius: '16px',
          minWidth: '500px',
          maxWidth: '90vw',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: '#fff' }} />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              Nova Conta
            </h2>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoveredButton('close')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: hoveredButton === 'close' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 85, 99, 0.3)',
              color: hoveredButton === 'close' ? '#f87171' : '#9ca3af',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Descrição */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              color: '#d1d5db',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <FileText size={16} />
              Descrição*
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Conta de luz"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(31, 41, 55, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)'}
            />
          </div>

          {/* Categoria */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              color: '#d1d5db',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              <Tag size={16} />
              Categoria*
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ex: Utilidades"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(31, 41, 55, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)'}
            />
          </div>

          {/* Data e Valor - Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Data de Vencimento */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                color: '#d1d5db',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <Calendar size={16} />
                Vencimento*
              </label>
              <input
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(31, 41, 55, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  colorScheme: 'dark'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)'}
              />
            </div>

            {/* Valor */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                color: '#d1d5db',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <DollarSign size={16} />
                Valor (R$)*
              </label>
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(31, 41, 55, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)'}
              />
            </div>
          </div>

          {/* Observações */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#d1d5db',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(31, 41, 55, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)'}
            />
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              onMouseEnter={() => setHoveredButton('cancel')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: hoveredButton === 'cancel' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: '#f87171',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              onMouseEnter={() => setHoveredButton('save')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: hoveredButton === 'save'
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: hoveredButton === 'save'
                  ? '0 6px 20px rgba(16, 185, 129, 0.4)'
                  : '0 4px 12px rgba(16, 185, 129, 0.3)',
                transform: hoveredButton === 'save' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <Save size={18} />
              Salvar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}