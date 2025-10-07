'use client'

import { useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js' // Importe o tipo SupabaseClient


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
      // Limpa campos
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '350px' }}>
        <h2 style={{ marginBottom: '10px' }}>Nova Conta</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Descrição*</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Categoria*</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Data de Vencimento*</label>
            <input
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Valor (R$)*</label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              style={{ width: '100%', padding: '5px', background:'#FFFFFF', color: '#000000' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding:'5px 10px', cursor:'pointer', borderRadius:'6px', border:'none', background:'#f87171', color:'#fff' }}>
              Fechar
            </button>
            <button type="submit" style={{ padding:'5px 10px', cursor:'pointer', borderRadius:'6px', border:'none', background:'#10b981', color:'#fff' }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
