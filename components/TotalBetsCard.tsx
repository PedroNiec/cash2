'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BarChart3 } from 'lucide-react'

const supabase = createClient(
  'https://ytiyrfliszifyuhghiqg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
)

export default function TotalBetsCard() {
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)

  const fetchTotal = async () => {
    setLoading(true)
    const { count, error } = await supabase
      .from('bets')
      .select('*', { count: 'exact', head: true })

    setTotal(error ? 0 : count || 0)
    setLoading(false)
  }

  useEffect(() => { fetchTotal() }, [])

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
            ? '0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.15)'
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
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(16,185,129,0.3)'
        }}>
          <BarChart3 size={28} style={{ color: '#fff' }} />
        </div>

        <h2 style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Apostas Feitas
        </h2>

        <div style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          lineHeight: '1.1'
        }}>
          {loading ? (
            <div style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }} />
          ) : (
            total?.toLocaleString('pt-BR') || '0'
          )}
        </div>

        <p style={{
          margin: '4px 0 0',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          Total registradas
        </p>
      </div>
    </>
  )
}