'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Wallet } from 'lucide-react'

const supabase = createClient(
  'https://ytiyrfliszifyuhghiqg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
)

type Balance = {
  id: string
  balance: number
}

export default function TotalBankCard() {
  const [data, setData] = useState<Balance[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)

  const fetchTotal = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('balance')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)

    if (error) {
      console.error(error)
      setData(null)
    } else {
      setData(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchTotal() }, [])

  const ultimoBalance = data && data.length > 0 ? data[0].balance : 0

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '220px',
          height: '220px',
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: hovered
            ? '0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.15)'
            : '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          animation: 'slideUp 0.4s ease-out',
          cursor: 'default'
        } as React.CSSProperties}
      >
        {/* Ícone com gradiente azul (banca) */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(59,130,246,0.3)'
        }}>
          <Wallet size={28} style={{ color: '#fff' }} />
        </div>

        {/* Título */}
        <h2 style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Saldo Atual
        </h2>

        {/* Valor grande */}
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#3b82f6',
          textAlign: 'center',
          lineHeight: '1.1',
          maxWidth: '100%',
          wordBreak: 'break-all'
        }}>
          {loading ? (
            <div style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }} />
          ) : (
            `R$ ${Number(ultimoBalance).toFixed(2).replace('.', ',')}`
          )}
        </div>

        {/* Legenda */}
        <p style={{
          margin: '4px 0 0',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          {loading ? 'Carregando...' : 'Último registro'}
        </p>
      </div>
    </>
  )
}