'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { X, Calendar, Trophy, Home, Users, DollarSign, Search } from 'lucide-react'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Bet = {
  id?: string
  date: string
  market_id: number | null
  championship_id: number | null
  home_team_id: number | null
  away_team_id: number | null
  stake: number
  profit_loss: number | null
  percentage: number | null
  status: string
}

type BetModalProps = {
  show: boolean
  onClose: () => void
  onSave: () => void
  editingBet: Bet | null
}

export default function BetModal({ show, onClose, onSave, editingBet }: BetModalProps) {
  const now = new Date()
  const formattedDate = now.toISOString().slice(0, 16)

  const [form, setForm] = useState({
    date: formattedDate,
    market_id: '',
    championship_id: '',
    home_team_id: '',
    away_team_id: '',
    stake: '',
    profit_loss: '',
    percentage: '',
    status: 'pending',
  })

  const [championships, setChampionships] = useState<{ id: number; name: string }[]>([])
  const [champSearch, setChampSearch] = useState('')
  const [showChampDropdown, setShowChampDropdown] = useState(false)

  const [teams, setTeams] = useState<{ id: number; name: string }[]>([])
  const [teamSearchHome, setTeamSearchHome] = useState('')
  const [teamSearchAway, setTeamSearchAway] = useState('')
  const [showHomeDropdown, setShowHomeDropdown] = useState(false)
  const [showAwayDropdown, setShowAwayDropdown] = useState(false)

  const [markets, setMarkets] = useState<{ id: number; name: string }[]>([])
  const [marketSearch, setMarketSearch] = useState('')
  const [showMarketDropdown, setShowMarketDropdown] = useState(false)

  const [hoveredBtn, setHoveredBtn] = useState<'save' | 'cancel' | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [champs, teamsData, marketsData] = await Promise.all([
        supabase.from('championships').select('*').order('name'),
        supabase.from('teams').select('*').order('name'),
        supabase.from('markets').select('*').order('name')
      ])
      if (champs.data) setChampionships(champs.data)
      if (teamsData.data) setTeams(teamsData.data)
      if (marketsData.data) setMarkets(marketsData.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (editingBet) {
      setForm({
        date: editingBet.date || formattedDate,
        market_id: editingBet.market_id?.toString() || '',
        championship_id: editingBet.championship_id?.toString() || '',
        home_team_id: editingBet.home_team_id?.toString() || '',
        away_team_id: editingBet.away_team_id?.toString() || '',
        stake: editingBet.stake?.toString() || '',
        profit_loss: editingBet.profit_loss?.toString() || '',
        percentage: editingBet.percentage?.toString() || '',
        status: editingBet.status || 'pending',
      })
      setChampSearch(championships.find(c => c.id === editingBet.championship_id)?.name || '')
      setTeamSearchHome(teams.find(t => t.id === editingBet.home_team_id)?.name || '')
      setTeamSearchAway(teams.find(t => t.id === editingBet.away_team_id)?.name || '')
      setMarketSearch(markets.find(m => m.id === editingBet.market_id)?.name || '')
    } else {
      resetForm()
    }
  }, [editingBet, championships, teams, markets])

  const resetForm = () => {
    setForm({
      date: formattedDate,
      market_id: '', championship_id: '', home_team_id: '', away_team_id: '',
      stake: '', profit_loss: '', percentage: '', status: 'pending'
    })
    setChampSearch(''); setTeamSearchHome(''); setTeamSearchAway(''); setMarketSearch('')
  }

  const handleSave = async () => {
    const payload = {
      date: form.date,
      market_id: form.market_id ? parseInt(form.market_id) : null,
      championship_id: form.championship_id ? parseInt(form.championship_id) : null,
      home_team_id: form.home_team_id ? parseInt(form.home_team_id) : null,
      away_team_id: form.away_team_id ? parseInt(form.away_team_id) : null,
      stake: parseFloat(form.stake) || 0,
      profit_loss: form.profit_loss ? parseFloat(form.profit_loss) : null,
      percentage: form.percentage ? parseFloat(form.percentage) : null,
      status: form.status,
    }

    if (editingBet?.id) {
      await supabase.from('bets').update(payload).eq('id', editingBet.id)
    } else {
      await supabase.from('bets').insert([payload])
    }

    resetForm()
    onSave()
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-enter { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      <div className="modal-enter" style={{
        background: 'rgba(31, 41, 55, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(75, 85, 99, 0.4)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        padding: '32px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <DollarSign size={36} style={{ color: '#10b981' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              {editingBet ? 'Editar Aposta' : 'Nova Aposta'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Data */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
              <Calendar size={18} /> Data e Hora
            </label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(55, 65, 81, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                color: '#e5e7eb',
                fontSize: '1rem',
                backdropFilter: 'blur(4px)'
              }}
            />
          </div>

          {/* Mercado */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
              <Search size={18} /> Mercado
            </label>
            <input
              type="text"
              placeholder="Pesquisar mercado..."
              value={marketSearch}
              onChange={(e) => setMarketSearch(e.target.value)}
              onFocus={() => setShowMarketDropdown(true)}
              onBlur={() => setTimeout(() => setShowMarketDropdown(false), 200)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(55, 65, 81, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                color: '#e5e7eb',
                fontSize: '1rem'
              }}
            />
            {showMarketDropdown && markets.length > 0 && (
              <ul style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                maxHeight: '200px', overflowY: 'auto',
                background: 'rgba(31, 41, 55, 0.95)', border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px', marginTop: '8px', padding: 0, listStyle: 'none'
              }}>
                {markets
                  .filter(m => m.name.toLowerCase().includes(marketSearch.toLowerCase()))
                  .map(m => (
                    <li
                      key={m.id}
                      onMouseDown={() => {
                        setForm({ ...form, market_id: m.id.toString() })
                        setMarketSearch(m.name)
                        setShowMarketDropdown(false)
                      }}
                      style={{
                        padding: '12px 16px',
                        color: '#e5e7eb',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {m.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Campeonato */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
              <Trophy size={18} /> Campeonato
            </label>
            <input
              type="text"
              placeholder="Pesquisar campeonato..."
              value={champSearch}
              onChange={(e) => setChampSearch(e.target.value)}
              onFocus={() => setShowChampDropdown(true)}
              onBlur={() => setTimeout(() => setShowChampDropdown(false), 200)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(55, 65, 81, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                color: '#e5e7eb',
                fontSize: '1rem'
              }}
            />
            {showChampDropdown && championships.length > 0 && (
              <ul style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                maxHeight: '200px', overflowY: 'auto',
                background: 'rgba(31, 41, 55, 0.95)', border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px', marginTop: '8px', padding: 0, listStyle: 'none'
              }}>
                {championships
                  .filter(c => c.name.toLowerCase().includes(champSearch.toLowerCase()))
                  .map(c => (
                    <li
                      key={c.id}
                      onMouseDown={() => {
                        setForm({ ...form, championship_id: c.id.toString() })
                        setChampSearch(c.name)
                        setShowChampDropdown(false)
                      }}
                      style={{
                        padding: '12px 16px',
                        color: '#e5e7eb',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {c.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Times */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Mandante */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
                <Home size={18} /> Mandante
              </label>
              <input
                type="text"
                placeholder="Time da casa..."
                value={teamSearchHome}
                onChange={(e) => setTeamSearchHome(e.target.value)}
                onFocus={() => setShowHomeDropdown(true)}
                onBlur={() => setTimeout(() => setShowHomeDropdown(false), 200)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(55, 65, 81, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px',
                  color: '#e5e7eb',
                  fontSize: '1rem'
                }}
              />
              {showHomeDropdown && teams.length > 0 && (
                <ul style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                  maxHeight: '200px', overflowY: 'auto',
                  background: 'rgba(31, 41, 55, 0.95)', border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px', marginTop: '8px', padding: 0, listStyle: 'none'
                }}>
                  {teams
                    .filter(t => t.name.toLowerCase().includes(teamSearchHome.toLowerCase()))
                    .map(t => (
                      <li
                        key={t.id}
                        onMouseDown={() => {
                          setForm({ ...form, home_team_id: t.id.toString() })
                          setTeamSearchHome(t.name)
                          setShowHomeDropdown(false)
                        }}
                        style={{
                          padding: '12px 16px',
                          color: '#e5e7eb',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {t.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Visitante */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
                <Users size={18} /> Visitante
              </label>
              <input
                type="text"
                placeholder="Time visitante..."
                value={teamSearchAway}
                onChange={(e) => setTeamSearchAway(e.target.value)}
                onFocus={() => setShowAwayDropdown(true)}
                onBlur={() => setTimeout(() => setShowAwayDropdown(false), 200)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(55, 65, 81, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px',
                  color: '#e5e7eb',
                  fontSize: '1rem'
                }}
              />
              {showAwayDropdown && teams.length > 0 && (
                <ul style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                  maxHeight: '200px', overflowY: 'auto',
                  background: 'rgba(31, 41, 55, 0.95)', border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px', marginTop: '8px', padding: 0, listStyle: 'none'
                }}>
                  {teams
                    .filter(t => t.name.toLowerCase().includes(teamSearchAway.toLowerCase()))
                    .map(t => (
                      <li
                        key={t.id}
                        onMouseDown={() => {
                          setForm({ ...form, away_team_id: t.id.toString() })
                          setTeamSearchAway(t.name)
                          setShowAwayDropdown(false)
                        }}
                        style={{
                          padding: '12px 16px',
                          color: '#e5e7eb',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {t.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Stake */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
              <DollarSign size={18} /> Stake (R$)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.stake}
              onChange={(e) => setForm({ ...form, stake: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(55, 65, 81, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                color: '#10b981',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            />
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
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
              style  = {{
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
              Salvar Aposta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}