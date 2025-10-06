'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)


export default function ContasAReceberPage() {
  const [contas, setContas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contas_a_receber')
      .select('*')
      .order('data_entrada', { ascending: true })

    if (error) console.error(error)
    else setContas(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchContas()
  }, [])

  const deleteConta = async (id: string) => {
    const { error } = await supabase
      .from('contas_a_receber')
      .delete()
      .eq('id', id)
    if (error) console.error(error)
    else fetchContas()
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contas a Receber</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Data de Entrada</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((c) => (
              <tr key={c.id} className="border-t">
                <td>{c.descricao}</td>
                <td>{c.categoria}</td>
                <td>{c.data_entrada}</td>
                <td>R$ {c.valor}</td>
                <td>{c.status}</td>
                <td>
                  <button onClick={() => deleteConta(c.id)} className="text-red-500">Excluir</button>
                  {/* Futuramente editar */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
