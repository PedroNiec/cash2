'use client'

import { useState } from 'react'

interface ModalProps {
  supabase: any
  onClose: () => void
  onSaved: () => void
}

export default function ModalNovaContaReceber({ supabase, onClose, onSaved }: ModalProps) {
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().split('T')[0])
  const [valor, setValor] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase.from('contas_a_receber').insert([{
      descricao,
      categoria,
      data_entrada: dataEntrada,
      valor: parseFloat(valor),
      observacoes
    }])
    setLoading(false)
    if (error) console.error(error)
    else {
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
        <h2 style={{ marginBottom:'10px' }}>Nova Conta a Receber</h2>

        <div style={{ marginBottom:'10px' }}>
          <label>Descrição</label>
          <input value={descricao} onChange={e=>setDescricao(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Categoria</label>
          <input value={categoria} onChange={e=>setCategoria(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Data de Entrada</label>
          <input type="date" value={dataEntrada} onChange={e=>setDataEntrada(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Valor (R$)</label>
          <input type="number" step="0.01" value={valor} onChange={e=>setValor(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ marginBottom:'10px' }}>
          <label>Observações</label>
          <textarea value={observacoes} onChange={e=>setObservacoes(e.target.value)} style={{ width:'100%', padding:'5px' }} />
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
          <button onClick={onClose} style={{ padding:'5px 10px', borderRadius:'6px', border:'none', background:'#f87171', color:'#fff', cursor:'pointer' }} disabled={loading}>Fechar</button>
          <button onClick={handleSave} style={{ padding:'5px 10px', borderRadius:'6px', border:'none', background:'#10b981', color:'#fff', cursor:'pointer' }} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </div>
  )
}
