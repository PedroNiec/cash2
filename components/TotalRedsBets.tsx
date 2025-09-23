'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function TotalRedsCard() {
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReds = async () => {
    setLoading(true)
  
    const { count, error } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'red') 
  
    if (error) {
      console.error(error)
      setTotal(0)
    } else {
      setTotal(count || 0)
    }
  
    setLoading(false)
  }
  

  useEffect(() => { fetchReds() }, [])

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
      <h2 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#374151' }}>Total de reds</h2>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: total !== null ? (total >= 0 ? '#EF4444' : '#ef4444') : '#111827' }}>
        {loading ? '...' : `${total}`}
    </p>

    </div>
  )
}
