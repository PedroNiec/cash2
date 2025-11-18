'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Calendar, DollarSign, TrendingUp, Award, X, FileText, Paperclip, AlertCircle, Lock, XCircle, CheckCircle } from 'lucide-react'

// Configurações Supabase
const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)


interface Attachment {
  filename: string
  url: string
  mimetype: string
  size: number
}

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
  attachments: Attachment[]
  provisioned: boolean
}

interface FechamentoViewModalProps {
  show: boolean
  onClose: () => void
  fechamento: Fechamento | null
  onUpdate: () => void
}

// --- MODAL DE APROVAÇÃO (NOVO COMPONENTE ANINHADO) ---

interface AdminApprovalModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (action: 'approve' | 'reject', observacaoAdmin: string) => void
}

function AdminApprovalModal({ show, onClose, onSubmit }: AdminApprovalModalProps) {
  const [observacaoAdmin, setObservacaoAdmin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!show) return null

  // Handler para os botões Aprovar/Reprovar
  const handleSubmit = async (action: 'approve' | 'reject') => {
    setIsSubmitting(true)
    await onSubmit(action, observacaoAdmin)
    setIsSubmitting(false)
    setObservacaoAdmin('') // Limpa o campo após o envio
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      zIndex: 110 // Z-index maior que o modal principal
    }}>
      <div style={{
        background: 'rgba(31, 41, 55, 0.98)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            Finalizar Fechamento
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(75, 85, 99, 0.4)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(75, 85, 99, 0.2)' }}
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

        {/* Campo Observação Admin */}
        <div>
          <label htmlFor="observacao_admin" style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '8px',
            display: 'block'
          }}>
            Observação (Admin)
          </label>
          <textarea
            id="observacao_admin"
            rows={4}
            value={observacaoAdmin}
            onChange={(e) => setObservacaoAdmin(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(17, 24, 39, 0.8)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '8px',
              color: '#e5e7eb',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            placeholder="Adicione uma observação para esta aprovação/reprovação..."
          />
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={() => handleSubmit('reject')} // Reprovar: muda status_dia para REJECTED
            disabled={isSubmitting}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            <XCircle size={20} />
            Reprovar
          </button>
          <button
            onClick={() => handleSubmit('approve')} // Aprovar: muda status_dia para APPROVED
            disabled={isSubmitting}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            <CheckCircle size={20} />
            Aprovar
          </button>
        </div>
      </div>
    </div>
  )
}

// --- MODAL PRINCIPAL (MODIFICADO) ---

export default function FechamentoViewModal({ show, onClose, fechamento, onUpdate }: FechamentoViewModalProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [hoveredAttachment, setHoveredAttachment] = useState<number | null>(null)
  
  // Estado para controlar o segundo modal de aprovação/reprovação
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  useEffect(() => {
    if (fechamento) {
      setAttachments(fechamento.attachments || [])
    }
  }, [fechamento])

  // Lógica para atualizar o status e a observação no Supabase
  const handleApprovalSubmit = async (action: 'approve' | 'reject', observacaoAdmin: string) => {
    if (!fechamento) return

    // Define o status conforme a ação
    const statusToUpdate = action === 'approve' ? 'APPROVED' : 'REJECTED'
    
    // Data a ser enviada ao Supabase (status_dia e observacao_admin)
    const dataToUpdate = {
      status_dia: statusToUpdate,
      observacao_admin: observacaoAdmin || null // Salva null se a string estiver vazia
    }

    try {
      // Executa o update na tabela 'fechamento_dia'
      const { error } = await supabase
        .from('fechamento_dia')
        .update(dataToUpdate)
        .eq('id', fechamento.id)

      if (error) {
        throw error
      }

      // Sucesso: fecha modais e atualiza lista
      console.log(`Fechamento ${fechamento.id} ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso.`)
      setShowApprovalModal(false) // Fecha o modal de aprovação
      onClose() // Fecha o modal principal
      onUpdate() // Notifica o componente pai para atualizar a lista

    } catch (error) {
        console.log(error);
      console.error('Erro ao atualizar status do fechamento:')
    }
  }

  if (!show || !fechamento) return null

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
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '0.875rem',
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

  const handleUploadComplete = async (newAttachments: Attachment[]) => {
    const updatedAttachments = [...attachments, ...newAttachments]
    
    try {
      const { error } = await supabase
        .from('fechamento_dia')
        .update({ attachments: updatedAttachments })
        .eq('id', fechamento.id)

      if (error) {
        console.error('Erro ao salvar anexos: ' + error.message)
      } else {
        setAttachments(updatedAttachments)
        onUpdate()
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar anexos', err)
    }
  }

  const canUpload = fechamento.status_dia === 'PENDING_APPROVAL' && attachments.length < 5

  return (
    // Usamos um Fragment (<>) para renderizar os dois modais
    <>
      {/* --- MODAL PRINCIPAL --- */}
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
          maxWidth: '900px',
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
              <Calendar size={28} style={{ color: '#8b5cf6' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                Fechamento - {formatDate(fechamento.data)}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {getStatusBadge(fechamento.status_dia)}
              <button
                onClick={onClose}
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
          </div>

          {/* Dados dos Métodos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { label: 'Método 1', lucro: fechamento.m1_lucro, ops: fechamento.m1_ops },
              { label: 'Método 2', lucro: fechamento.m2_lucro, ops: fechamento.m2_ops },
              { label: 'Método 3', lucro: fechamento.m3_lucro, ops: fechamento.m3_ops }
            ].map((metodo, idx) => (
              <div key={idx} style={{
                padding: '20px',
                background: 'rgba(55, 65, 81, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <h4 style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                  fontWeight: '600'
                }}>
                  {metodo.label}
                </h4>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: metodo.lucro >= 0 ? '#10b981' : '#f87171',
                  marginBottom: '8px'
                }}>
                  {formatCurrency(metodo.lucro)}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af'
                }}>
                  {metodo.ops} operações
                </p>
              </div>
            ))}
          </div>

          {/* Totalizadores */}
          <div style={{
            padding: '24px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Award size={24} style={{ color: '#a78bfa' }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#a78bfa',
                margin: 0
              }}>
                Totalizadores
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#d1d5db', fontSize: '1rem' }}>Total do Dia:</span>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: fechamento.total_dia >= 0 ? '#10b981' : '#f87171'
                }}>
                  {formatCurrency(fechamento.total_dia)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#d1d5db' }}>% da Meta (R$ 400):</span>
                <span style={{ fontWeight: '600', color: '#a78bfa', fontSize: '1.125rem' }}>
                  {fechamento.pct_meta.toFixed(2)}%
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#d1d5db' }}>Delta da Meta:</span>
                <span style={{
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  color: fechamento.delta_meta >= 0 ? '#10b981' : '#f87171'
                }}>
                  {formatCurrency(fechamento.delta_meta)}
                </span>
              </div>
            </div>
          </div>

          {/* Caixa Reconciliado */}
          {fechamento.reconciled_cash !== null && (
            <div style={{
              padding: '16px',
              background: 'rgba(55, 65, 81, 0.4)',
              borderRadius: '10px',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} style={{ color: '#9ca3af' }} />
                <span style={{ color: '#d1d5db' }}>Caixa Reconciliado:</span>
              </div>
              <span style={{ fontWeight: '600', color: '#fff', fontSize: '1.125rem' }}>
                {formatCurrency(fechamento.reconciled_cash)}
              </span>
            </div>
          )}

          {/* Observações */}
          {fechamento.observacoes && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <FileText size={20} style={{ color: '#9ca3af' }} />
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#d1d5db',
                  margin: 0
                }}>
                  Observações
                </h3>
              </div>
              <p style={{
                padding: '16px',
                background: 'rgba(55, 65, 81, 0.4)',
                borderRadius: '10px',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                color: '#e5e7eb',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                margin: 0
              }}>
                {fechamento.observacoes}
              </p>
            </div>
          )}

          {/* Anexos */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Paperclip size={20} style={{ color: '#9ca3af' }} />
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#d1d5db',
                  margin: 0
                }}>
                  Anexos ({attachments.length}/5)
                </h3>
              </div>
              {fechamento.status_dia === 'APPROVED' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  background: 'rgba(75, 85, 99, 0.3)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  <Lock size={14} />
                  <span>Bloqueado</span>
                </div>
              )}
            </div>

            {attachments.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredAttachment(idx)}
                    onMouseLeave={() => setHoveredAttachment(null)}
                    style={{
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      borderRadius: '12px',
                      padding: '12px',
                      background: hoveredAttachment === idx
                        ? 'rgba(55, 65, 81, 0.5)'
                        : 'rgba(55, 65, 81, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '120px',
                      background: 'rgba(17, 24, 39, 0.5)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      border: '1px solid rgba(75, 85, 99, 0.2)'
                    }}>
                      <img
                        src={att.url}
                        alt={att.filename}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      marginBottom: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {att.filename}
                    </p>
                    <p style={{
                      fontSize: '0.7rem',
                      color: '#6b7280',
                      marginBottom: '10px'
                    }}>
                      {(att.size / 1024).toFixed(1)} KB
                    </p>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
                      }}
                      style={{
                        display: 'block',
                        padding: '8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        textAlign: 'center',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Abrir
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Uploader (Comentado) */}
            {/* ... */}

            {/* Mensagens de bloqueio */}
            {!canUpload && fechamento.status_dia === 'APPROVED' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(75, 85, 99, 0.4)'
              }}>
                <Lock size={16} style={{ color: '#9ca3af' }} />
                <p style={{
                  color: '#9ca3af',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  Uploads bloqueados - fechamento aprovado
                </p>
              </div>
            )}

            {!canUpload && fechamento.status_dia === 'PENDING_APPROVAL' && attachments.length >= 5 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <AlertCircle size={16} style={{ color: '#fbbf24' }} />
                <p style={{
                  color: '#fbbf24',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  Limite máximo de 5 anexos atingido
                </p>
              </div>
            )}
          </div>
          
          {/* Rodapé com Botões (MODIFICADO) */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(75, 85, 99, 0.3)',
            display: 'flex',
            justifyContent: 'flex-end', // Alinha itens à direita
            gap: '12px'
          }}>

            {/* Botão Finalizar agora é condicional */}
            {fechamento.status_dia === 'PENDING_APPROVAL' && (
              <button
                onClick={() => setShowApprovalModal(true)} // Abre o novo modal
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
                }}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(26, 121, 84, 0.2)',
                  color: '#ffffffff',
                  border: '1px solid rgba(44, 133, 66, 0.3)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Finalizar
              </button>
            )}
          </div>

        </div>
      </div>

      <AdminApprovalModal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleApprovalSubmit}
      />
    </>
  )
}