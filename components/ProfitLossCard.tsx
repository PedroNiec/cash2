'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ProfitLossCard() {
  const [pl, setPl] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPL = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bets')
      .select('profit_loss, status')

    if (error) console.error(error)
    else if (data) {
      const total = data
        .filter(b => b.status === 'green' || b.status === 'red')
        .reduce((sum, b) => sum + Number(b.profit_loss || 0), 0)
      setPl(total)
    }

    setLoading(false)
  }

  useEffect(() => { fetchPL() }, [])

  return (
    <div style={{
      aspectRatio: '1 / 1',
      padding: '20px',
      borderRadius: '12px',
      background: '#f9f9f9',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '180px'
    }}>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#374151' }}>P/L</h2>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: pl !== null ? (pl >= 0 ? '#10b981' : '#ef4444') : '#111827' }}>
        {loading ? '...' : `R$ ${Number(pl).toFixed(2)}`}
      </p>
    </div>
  )
}
