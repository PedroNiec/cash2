'use client'

import { useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

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

export default function ModalReceberConta({ supabase, conta, onClose, onSaved }: ModalProps) {
  const [valorRecebido, setValorRecebido] = useState(conta.valor)
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().split('T')[0])
  const [formaRecebimento, setFormaRecebimento] = useState('Dinheiro') // padrão
  const [observacoes, setObservacoes] = useState(conta.observacoes || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('contas_a_receber')
      .update({
        valor: valorRecebido,
        data_vencimento: dataRecebimento,
        status: 'Recebido',
        forma_recebimento: formaRecebimento,
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
    <div style={{
      position:'fixed', top:0,left:0,width:'100%',height:'100%',
      backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
    }}>
      <div style={{ background:'#fff', padding:'20px', borderRadius:'8px', minWidth:'350px' }}>
        <h2 style={{ marginBottom:'10px' }}>Receber Conta</h2>

        <div style={{ marginBottom:'10px' }}>
          <label>Descrição</label>
          <input type="text" value={conta.descricao} disabled style={{ width:'100%', padding:'5px', background:'#f3f4f6' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Valor Recebido (R$)</label>
          <input type="number" step="0.01" value={valorRecebido} onChange={e=>setValorRecebido(valorRecebido)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Data de Recebimento</label>
          <input type="date" value={dataRecebimento} onChange={e=>setDataRecebimento(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Forma de Recebimento</label>
          <select value={formaRecebimento} onChange={e => setFormaRecebimento(e.target.value)} style={{ width:'100%', padding:'5px' }}>
            <option>Dinheiro</option>
            <option>Pix</option>
            <option>Boleto</option>
            <option>Transferência</option>
            <option>Cartão de Crédito/Débito</option>
          </select>
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Observações</label>
          <textarea value={observacoes} onChange={e=>setObservacoes(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
          <button onClick={onClose} style={{ padding:'5px 10px', borderRadius:'6px', border:'none', background:'#f87171', color:'#fff', cursor:'pointer' }} disabled={loading}>Fechar</button>
          <button onClick={handleSave} style={{ padding:'5px 10px', borderRadius:'6px', border:'none', background:'#10b981', color:'#fff', cursor:'pointer' }} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
