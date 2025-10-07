'use client'

import { useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js' // Importe o tipo SupabaseClient

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

interface ModalProps {
  supabase: SupabaseClient
  conta: Conta
  onClose: () => void
  onSaved: () => void
}

export default function ModalPagarConta({ supabase, conta, onClose, onSaved }: ModalProps) {
  const [valorPago, setValorPago] = useState(conta.valor)
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0])
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')
  const [observacoes, setObservacoes] = useState(conta.observacoes || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)

    const { error } = await supabase
      .from('contas_a_pagar')
      .update({
        valor: valorPago,
        data_pagamento: dataPagamento,
        forma_pagamento: formaPagamento,
        status: 'Pago',
        observacoes,
      })
      .eq('id', conta.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Erro ao atualizar a conta')
    } else {
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '350px' }}>
        <h2 style={{ marginBottom: '10px' }}>Pagar Conta</h2>

        <div style={{ marginBottom: '10px' }}>
          <label>Descrição</label>
          <input
            type="text"
            value={conta.descricao}
            disabled
            style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Valor Pago (R$)</label>
          <input
            type="number"
            step="0.01"
            value={valorPago}
            onChange={(e) => setValorPago(valorPago)}
            style={{ width: '100%', padding: '5px', background:'#FFFFFF', color:'#111827' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Data de Pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Forma de Pagamento</label>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            style={{ width: '100%', padding: '5px', background:'#FFFFFF', color:'#111827' }}
          >
            <option>Dinheiro</option>
            <option>Pix</option>
            <option>Boleto</option>
            <option>Transferencia</option>
            <option>Cartão de crédito/débito</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            style={{ width: '100%', padding: '5px', background:'#FFFFFF', color:'#111827'  }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding:'5px 10px', cursor:'pointer', borderRadius:'6px', border:'none', background:'#f87171', color:'#fff' }}
            disabled={loading}
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            style={{ padding:'5px 10px', cursor:'pointer', borderRadius:'6px', border:'none', background:'#10b981', color:'#fff' }}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
