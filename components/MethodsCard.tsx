'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'

const supabase = createClient(supabaseUrl, supabaseKey)

type MethodPL = {
  name: string
  total: number
}

export default function MethodsCard() {
  const [data, setData] = useState<MethodPL[]>([])

  const fetchData = async () => {
    // Pega todas as apostas green/red
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('profit_loss, status, market_id')
      .in('status', ['green', 'red'])

    if (betsError || !bets) return console.error(betsError)

    // Pega os market_ids únicos presentes nas apostas
    const marketIds = Array.from(new Set(bets.map(b => b.market_id).filter(Boolean)))

    // Busca os nomes dos métodos
    const { data: markets, error: marketsError } = await supabase
      .from('markets')
      .select('id, name')
      .in('id', marketIds)

    if (marketsError || !markets) return console.error(marketsError)

    // Monta os dados por método
    const result: MethodPL[] = markets.map(market => {
      const total = bets
        .filter(b => b.market_id === market.id)
        .reduce((sum, b) => sum + Number(b.profit_loss || 0), 0)
      return { name: market.name, total }
    })

    setData(result)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div style={{
      gridColumn: '1 / -1',
      aspectRatio: '1 / 0.35',
      padding: '20px',
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ marginBottom: '10px', color: '#374151', textAlign: 'center' }}>
        📊 Lucro/Prejuízo por Método
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Bar dataKey="total">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.total >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
