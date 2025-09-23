'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'

const supabase = createClient(supabaseUrl, supabaseKey)

export default function TotalBankCard() {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTotal = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('balance')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)

    if (error) console.error(error)
    else setData(data)

    setLoading(false)
  }

  useEffect(() => { fetchTotal() }, [])

  const ultimoBalance = data && data.length > 0 ? data[0].balance : 0

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
      <h2 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#374151' }}>Saldo Atual</h2>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827' }}>
        {loading ? '...' : `R$ ${ultimoBalance?.toFixed(2) || '0.00'}`}
      </p>
    </div>
  )
}
