'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type DailyPL = { date: string; total: number }

export default function WeeklyPLChart() {
  const [data, setData] = useState<DailyPL[]>([])

  const fetchData = async () => {
    const today = new Date()
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const { data: bets, error } = await supabase
      .from('bets')
      .select('profit_loss, status, date')

    if (error) return

    const dailyData: DailyPL[] = last7Days.map(day => {
      const total = bets
        ?.filter(b => b.status === 'green' || b.status === 'red')
        .filter(b => b.date?.startsWith(day))
        .reduce((sum, b) => sum + Number(b.profit_loss || 0), 0) || 0
      return { date: day.slice(5), total } // MM-DD
    })

    setData(dailyData)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div style={{
      gridColumn: '1 / -1',
      aspectRatio: '1 / 0.25', // menor altura
      padding: '20px',
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ marginBottom: '10px', color: '#374151', textAlign: 'center' }}>
        📊 Resultados últimos 7 dias
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
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
