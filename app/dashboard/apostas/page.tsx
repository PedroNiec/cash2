'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import BetModal from '@/components/BetModal'
import SettleBetModal from '@/components/SettleBetModal'
import { Plus, RefreshCw, Edit, CheckCircle, TrendingUp, Calendar, DollarSign, Percent } from 'lucide-react'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Bet = {
  id: string
  date: string
  market_id: number | null
  stake: number
  profit_loss: number | null
  percentage: number | null
  status: string | null
}

type Market = { id: number; name: string }

export default function ApostasPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)
  const [showSettleModal, setShowSettleModal] = useState(false)
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  const [markets, setMarkets] = useState<Market[]>([])
  const marketMap = Object.fromEntries(markets.map(m => [m.id, m.name]))

  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)

    const [betsRes, marketsRes, balanceRes] = await Promise.all([
      supabase.from('bets').select('*').order('date', { ascending: false }),
      supabase.from('markets').select('*').order('name'),
      supabase.from('balance').select('balance').limit(1)
    ])

    if (betsRes.data) setBets(betsRes.data)
    if (marketsRes.data) setMarkets(marketsRes.data)
    if (balanceRes.data && balanceRes.data.length > 0) setBalance(balanceRes.data[0].balance || 0)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNew = () => {
    setEditingBet(null)
    setShowModal(true)
  }

  const handleEdit = (bet: Bet) => {
    setEditingBet(bet)
    setShowModal(true)
  }

  const handleSettle = (bet: Bet) => {
    setSelectedBet(bet)
    setShowSettleModal(true)
  }

  const formatDate = (date: string) => new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <TrendingUp size={40} style={{ color: '#10b981' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
            Apostas
          </h1>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
          Gerencie suas apostas e acompanhe seus resultados
        </p>
      </div>

      {/* Balance Card */}
      <div className="fade-in" style={{
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 15px 50px rgba(16, 185, 129, 0.35)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <DollarSign size={28} style={{ color: '#fff' }} />
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.1em' }}>
            SALDO ATUAL DA BANCA
          </span>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.02em' }}>
          R$ {balance !== null ? balance.toFixed(2).replace('.', ',') : '--'}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }} className="fade-in">
        <button
          onClick={handleNew}
          onMouseEnter={() => setHoveredButton('nova')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px',
            background: hoveredButton === 'nova'
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
            boxShadow: hoveredButton === 'nova'
              ? '0 10px 30px rgba(16, 185, 129, 0.5)'
              : '0 4px 15px rgba(16, 185, 129, 0.3)',
            transform: hoveredButton === 'nova' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={22} />
          Nova Aposta
        </button>

        <button
          onClick={fetchData}
          onMouseEnter={() => setHoveredButton('atualizar')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px',
            background: hoveredButton === 'atualizar' ? '#374151' : '#4b5563',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
            boxShadow: hoveredButton === 'atualizar'
              ? '0 4px 15px rgba(75, 85, 99, 0.4)'
              : '0 2px 8px rgba(75, 85, 99, 0.2)',
            transform: hoveredButton === 'atualizar' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <RefreshCw size={22} className={loading ? 'spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(31, 41, 55, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
      }}>
        {loading ? (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <div className="spin" style={{
              width: '56px', height: '56px', border: '5px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto'
            }} />
          </div>
        ) : bets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <TrendingUp size={80} style={{ color: '#4b5563', margin: '0 auto 20px' }} />
            <p style={{ color: '#9ca3af', fontSize: '1.25rem' }}>Nenhuma aposta registrada ainda</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(17, 24, 39, 0.9)', borderBottom: '1px solid rgba(75, 85, 99, 0.5)' }}>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} /> Data
                    </div>
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mercado
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Stake
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Lucro
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Percent size={16} /> ROI
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </th>
                  <th style={{ padding: '18px 24px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet, i) => (
                  <tr
                    key={bet.id}
                    onMouseEnter={() => setHoveredRow(bet.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="fade-in"
                    style={{
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                      background: hoveredRow === bet.id ? 'rgba(55, 65, 81, 0.4)' : 'transparent',
                      transition: 'background 0.25s ease',
                      animationDelay: `${i * 40}ms`
                    }}
                  >
                    <td style={{ padding: '18px 24px', color: '#e5e7eb', fontSize: '0.95rem' }}>
                      {formatDate(bet.date)}
                    </td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{
                        padding: '6px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600',
                        background: 'rgba(139, 92, 246, 0.25)', color: '#c4b5fd',
                        border: '1px solid rgba(139, 92, 246, 0.4)'
                      }}>
                        {marketMap[bet.market_id || 0] || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'right', color: '#e5e7eb', fontWeight: '600' }}>
                      R$ {bet.stake.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '18px 24px',
                      textAlign: 'right',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: bet.profit_loss && bet.profit_loss > 0 ? '#10b981' : bet.profit_loss && bet.profit_loss < 0 ? '#f87171' : '#9ca3af'
                    }}>
                      {bet.profit_loss ? (bet.profit_loss > 0 ? '+' : '') + bet.profit_loss.toFixed(2) : '—'}
                    </td>
                    <td style={{
                      padding: '18px 24px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: bet.percentage && bet.percentage > 0 ? '#10b981' : bet.percentage && bet.percentage < 0 ? '#f87171' : '#9ca3af'
                    }}>
                      {bet.percentage ? (bet.percentage > 0 ? '+' : '') + bet.percentage.toFixed(1) + '%' : '—'}
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 16px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        background: bet.status === 'green' ? 'rgba(16, 185, 129, 0.2)' : bet.status === 'red' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: bet.status === 'green' ? '#10b981' : bet.status === 'red' ? '#f87171' : '#fbbf24',
                        border: bet.status === 'green' ? '1px solid rgba(16, 185, 129, 0.4)' : bet.status === 'red' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)'
                      }}>
                        {bet.status === 'green' ? 'Green' : bet.status === 'red' ? 'Red' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {(!bet.status || bet.status === 'pending') && (
                          <button
                            onClick={() => handleSettle(bet)}
                            style={{
                              padding: '10px 16px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px',
                              fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.35)'; e.currentTarget.style.transform = 'scale(1.05)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; e.currentTarget.style.transform = 'scale(1)' }}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(bet)}
                          style={{
                            padding: '10px 16px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '10px',
                            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.35)'; e.currentTarget.style.transform = 'scale(1.05)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'; e.currentTarget.style.transform = 'scale(1)' }}
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <BetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => { setShowModal(false); fetchData() }}
        editingBet={editingBet}
      />

      <SettleBetModal
        show={showSettleModal}
        bet={selectedBet}
        onClose={() => setShowSettleModal(false)}
        onSaved={() => { setShowSettleModal(false); fetchData() }}
      />
    </div>
  )
}