'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X, CheckCircle, XCircle, DollarSign, Percent } from 'lucide-react'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Bet = {
  id: string
  stake: number
  status: string | null
  profit_loss: number | null
  percentage: number | null
}

type SettleBetModalProps = {
  show: boolean
  bet: Bet | null
  onClose: () => void
  onSaved: () => void
}

export default function SettleBetModal({ show, bet, onClose, onSaved }: SettleBetModalProps) {
  const [result, setResult] = useState<'green' | 'red'>('green')
  const [returnedValue, setReturnedValue] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(0)
  const [hoveredBtn, setHoveredBtn] = useState<'save' | 'cancel' | null>(null)

  useEffect(() => {
  if (bet) {
    const initialValue = bet.profit_loss !== null && bet.profit_loss !== undefined
      ? String(Math.abs(bet.profit_loss))
      : ''
    setReturnedValue(initialValue)
    setPercentage(bet.stake && bet.profit_loss ? (bet.profit_loss / bet.stake) * 100 : 0)

    if (bet.profit_loss !== null && bet.profit_loss !== undefined) {
      setResult(bet.profit_loss >= 0 ? 'green' : 'red')
    } else {
      setResult('green')
    }
  }
}, [bet])

  useEffect(() => {
    if (bet && returnedValue !== '' && !isNaN(parseFloat(returnedValue))) {
      const value = parseFloat(returnedValue)
      const calc = bet.stake ? (value / bet.stake) * 100 : 0
      setPercentage(calc)
    }
  }, [returnedValue, bet])

  if (!show || !bet) return null

  const handleSave = async () => {
    if (returnedValue === '' || isNaN(parseFloat(returnedValue))) {
      alert('Preencha um valor retornado válido.')
      return
    }

    const value = parseFloat(returnedValue)
    const profitLoss = result === 'green' ? value : -value
    const finalPercentage = bet.stake ? (profitLoss / bet.stake) * 100 : 0

    await supabase
      .from('bets')
      .update({
        status: result,
        profit_loss: profitLoss,
        percentage: finalPercentage
      })
      .eq('id', bet.id)

    // Atualiza saldo geral
    const { data: balanceData } = await supabase.from('balance').select('*').limit(1)
    
    if (balanceData && balanceData.length > 0) {
      const currentBalance = balanceData[0].balance || 0
      const newBalance = currentBalance + profitLoss
      await supabase.from('balance').update({ balance: newBalance }).eq('id', balanceData[0].id)
    }

    onSaved()
  }

  const displayPercentage = returnedValue !== '' && !isNaN(parseFloat(returnedValue))
    ? (result === 'green' ? percentage : -percentage).toFixed(2)
    : '0.00'

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-enter { animation: fadeIn 0.35s ease-out forwards; }
      `}</style>

      <div className="modal-enter" style={{
        background: 'rgba(31, 41, 55, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
        padding: '32px',
        color: '#fff'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {result === 'green' ? (
              <CheckCircle size={38} style={{ color: '#10b981' }} />
            ) : (
              <XCircle size={38} style={{ color: '#ef4444' }} />
            )}
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              Fechar Aposta
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          >
            <X size={26} />
          </button>
        </div>

        {/* Resultado */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d1d5db', fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px' }}>
            Resultado da Aposta
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setResult('green')}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                border: result === 'green' ? '2px solid #10b981' : '1px solid rgba(75, 85, 99, 0.6)',
                background: result === 'green' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(55, 65, 81, 0.5)',
                color: result === 'green' ? '#10b981' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: result === 'green' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
                cursor: 'pointer'
              }}
            >
              <CheckCircle size={22} />
              Green
            </button>
            <button
              onClick={() => setResult('red')}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                border: result === 'red' ? '2px solid #ef4444' : '1px solid rgba(75, 85, 99, 0.6)',
                background: result === 'red' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(55, 65, 81, 0.5)',
                color: result === 'red' ? '#ef4444' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: result === 'red' ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none',
                cursor: 'pointer'
              }}
            >
              <XCircle size={22} />
              Red
            </button>
          </div>
        </div>

        {/* Valor Retornado */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
            <DollarSign size={18} /> Valor Retornado (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={returnedValue}
            onChange={(e) => setReturnedValue(e.target.value)}
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '16px 18px',
              background: 'rgba(55, 65, 81, 0.6)',
              border: '1px solid rgba(75, 85, 99, 0.6)',
              borderRadius: '12px',
              color: '#10b981',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}
          />
        </div>

        {/* Percentual */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
            <Percent size={18} /> ROI (%)
          </label>
          <div style={{
            padding: '16px 18px',
            background: result === 'green' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${result === 'green' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: result === 'green' ? '#10b981' : '#ef4444'
          }}>
            {result === 'green' ? '+' : '-'}{displayPercentage}%
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoveredBtn('cancel')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              padding: '14px 32px',
              background: hoveredBtn === 'cancel' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredBtn === 'cancel' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredBtn === 'cancel' ? '0 8px 25px rgba(239, 68, 68, 0.3)' : '0 4px 15px rgba(239, 68, 68, 0.2)'
            }}
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            onMouseEnter={() => setHoveredBtn('save')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              padding: '14px 32px',
              background: hoveredBtn === 'save'
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredBtn === 'save' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredBtn === 'save'
                ? '0 10px 30px rgba(16, 185, 129, 0.5)'
                : '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            Confirmar Fechamento
          </button>
        </div>
      </div>
    </div>
  )
}