'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function FinanceiroDash() {
  const [data, setData] = useState<{ pagar: number; receber: number }>({ pagar: 0, receber: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Contas a pagar pendentes
      const { data: pagarData, error: pagarError } = await supabase
        .from('contas_a_pagar')
        .select('valor')
        .eq('status', 'Pendente')

      // Contas a receber pendentes
      const { data: receberData, error: receberError } = await supabase
        .from('contas_a_receber')
        .select('valor')
        .eq('status', 'Pendente')

      if (pagarError || receberError) {
        console.error(pagarError || receberError)
        setLoading(false)
        return
      }

      const totalPagar = pagarData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
      const totalReceber = receberData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

      setData({ pagar: totalPagar, receber: totalReceber })
      setLoading(false)
    }

    fetchData()
  }, [])

  const chartData = [
    { name: 'Contas a Pagar', total: data.pagar },
    { name: 'Contas a Receber', total: data.receber },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Dashboard Financeira</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Gráfico Contas a Pagar */}
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ef4444' }}>Contas a Pagar</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: 'Pendente', valor: data.pagar }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="valor" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Contas a Receber */}
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#10b981' }}>Contas a Receber</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{ name: 'Pendente', valor: data.receber }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="valor" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
