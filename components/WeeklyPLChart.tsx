'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { Calendar } from 'lucide-react'

const supabase = createClient(
  'https://ytiyrfliszifyuhghiqg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
)

type DailyPL = { date: string; total: number }

export default function WeeklyPLChart() {
  const [data, setData] = useState<DailyPL[]>([])
  const [hovered, setHovered] = useState(false)

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

    if (error || !bets) return

    const dailyData: DailyPL[] = last7Days.map(day => {
      const total = bets
        .filter(b => b.status === 'green' || b.status === 'red')
        .filter(b => b.date?.startsWith(day))
        .reduce((sum, b) => sum + Number(b.profit_loss || 0), 0) || 0
      return { date: new Date(day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), total }
    })

    setData(dailyData)
  }

  useEffect(() => { fetchData() }, [])

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          gridColumn: '1 / -1',
          width: '100%',
          maxWidth: '100%',
          height: '220px',
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: hovered
            ? '0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.1)'
            : '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          animation: 'slideUp 0.5s ease-out'
        } as React.CSSProperties}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}>
            <Calendar size={20} style={{ color: '#fff' }} />
          </div>
          <h2 style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#e2e8f0',
            letterSpacing: '0.025em'
          }}>
            Últimos 7 Dias
          </h2>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.3)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9ca3af', fontSize: '0.75rem' }}
                axisLine={{ stroke: 'rgba(75,85,99,0.5)' }}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: '0.75rem' }}
                axisLine={{ stroke: 'rgba(75,85,99,0.5)' }}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid rgba(75,85,99,0.5)',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.total >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}