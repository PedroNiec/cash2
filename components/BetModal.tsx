'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  const formattedDate = now.toISOString().slice(0,16)

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

  useEffect(() => {
    const fetchChampionships = async () => {
      const { data } = await supabase.from('championships').select('*').order('name')
      if (data) setChampionships(data)
    }
    const fetchTeams = async () => {
      const { data } = await supabase.from('teams').select('*').order('name')
      if (data) setTeams(data)
    }
    const fetchMarkets = async () => {
      const { data } = await supabase.from('markets').select('*').order('name')
      if (data) setMarkets(data)
    }

    fetchChampionships()
    fetchTeams()
    fetchMarkets()
  }, [])

  useEffect(() => {
    if (editingBet) {
      setForm({
        date: editingBet.date,
        market_id: editingBet.market_id?.toString() || '',
        championship_id: editingBet.championship_id?.toString() || '',
        home_team_id: editingBet.home_team_id?.toString() || '',
        away_team_id: editingBet.away_team_id?.toString() || '',
        stake: editingBet.stake.toString(),
        profit_loss: editingBet.profit_loss?.toString() || '',
        percentage: editingBet.percentage?.toString() || '',
        status: editingBet.status,
      })
      setChampSearch(
        championships.find(c => c.id === editingBet.championship_id)?.name || ''
      )
      setTeamSearchHome(
        teams.find(t => t.id === editingBet.home_team_id)?.name || ''
      )
      setTeamSearchAway(
        teams.find(t => t.id === editingBet.away_team_id)?.name || ''
      )
      setMarketSearch(
        markets.find(m => m.id === editingBet.market_id)?.name || ''
      )
    } else {
      resetForm()
    }
  }, [editingBet, championships, teams, markets])

  const resetForm = () => {
    setForm({
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
    setChampSearch('')
    setTeamSearchHome('')
    setTeamSearchAway('')
    setMarketSearch('')
  }

  const handleSave = async () => {
    const payload = {
      date: form.date || new Date().toISOString(),
      market_id: form.market_id ? parseInt(form.market_id) : null,
      championship_id: form.championship_id ? parseInt(form.championship_id) : null,
      home_team_id: form.home_team_id ? parseInt(form.home_team_id) : null,
      away_team_id: form.away_team_id ? parseInt(form.away_team_id) : null,
      stake: parseFloat(form.stake),
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

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  if (!show) return null

  return (
    <div style={{
      position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
      backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center',
      alignItems:'center', padding:'20px', zIndex:50
    }}>
      <div style={{
        backgroundColor:'white', borderRadius:'15px', width:'100%', maxWidth:'600px',
        maxHeight:'90vh', display:'flex', flexDirection:'column', gap:'20px',
        overflowY:'auto', padding:'20px'
      }}>
        <h2 style={{ fontSize:'1.5rem', fontWeight:'bold' }}>
          {editingBet ? 'Editar Aposta' : 'Nova Aposta'}
        </h2>

        {/* Data */}
        <div>
          <label>Data</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }}
          />
        </div>

        {/* Mercado */}
        <div style={{ position:'relative' }}>
          <label>Mercado</label>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={marketSearch}
            onChange={(e) => setMarketSearch(e.target.value)}
            onFocus={() => setShowMarketDropdown(true)}
            onBlur={() => setTimeout(()=>setShowMarketDropdown(false),150)}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc', marginBottom:'5px' }}
          />
          {showMarketDropdown && (
            <ul style={{
              position:'absolute', top:'100%', left:0, right:0, maxHeight:'150px',
              overflowY:'auto', background:'white', border:'1px solid #ccc',
              borderRadius:'8px', margin:0, padding:0, listStyle:'none', zIndex:10
            }}>
              {markets.filter(m => m.name.toLowerCase().includes(marketSearch.toLowerCase()))
                .map(m => (
                  <li key={m.id} onClick={() => {
                    setForm({...form, market_id: m.id.toString()})
                    setMarketSearch(m.name)
                    setShowMarketDropdown(false)
                  }}
                    style={{ padding:'8px', cursor:'pointer' }}
                  >{m.name}</li>
                ))}
            </ul>
          )}
        </div>

        {/* Campeonato */}
        <div style={{ position:'relative' }}>
          <label>Campeonato</label>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={champSearch}
            onChange={(e) => setChampSearch(e.target.value)}
            onFocus={() => setShowChampDropdown(true)}
            onBlur={() => setTimeout(()=>setShowChampDropdown(false),150)}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc', marginBottom:'5px' }}
          />
          {showChampDropdown && (
            <ul style={{
              position:'absolute', top:'100%', left:0, right:0, maxHeight:'150px',
              overflowY:'auto', background:'white', border:'1px solid #ccc',
              borderRadius:'8px', margin:0, padding:0, listStyle:'none', zIndex:10
            }}>
              {championships.filter(c => c.name.toLowerCase().includes(champSearch.toLowerCase()))
                .map(c => (
                  <li key={c.id} onClick={() => {
                    setForm({...form, championship_id: c.id.toString()})
                    setChampSearch(c.name)
                    setShowChampDropdown(false)
                  }}
                    style={{ padding:'8px', cursor:'pointer' }}
                  >{c.name}</li>
                ))}
            </ul>
          )}
        </div>

        {/* Mandante */}
        <div style={{ position:'relative' }}>
          <label>Mandante</label>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={teamSearchHome}
            onChange={(e) => setTeamSearchHome(e.target.value)}
            onFocus={() => setShowHomeDropdown(true)}
            onBlur={() => setTimeout(()=>setShowHomeDropdown(false),150)}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc', marginBottom:'5px' }}
          />
          {showHomeDropdown && (
            <ul style={{
              position:'absolute', top:'100%', left:0, right:0, maxHeight:'150px',
              overflowY:'auto', background:'white', border:'1px solid #ccc',
              borderRadius:'8px', margin:0, padding:0, listStyle:'none', zIndex:10
            }}>
              {teams.filter(t => t.name.toLowerCase().includes(teamSearchHome.toLowerCase()))
                .map(t => (
                  <li key={t.id} onClick={() => {
                    setForm({...form, home_team_id: t.id.toString()})
                    setTeamSearchHome(t.name)
                    setShowHomeDropdown(false)
                  }}
                    style={{ padding:'8px', cursor:'pointer' }}
                  >{t.name}</li>
                ))}
            </ul>
          )}
        </div>

        {/* Visitante */}
        <div style={{ position:'relative' }}>
          <label>Visitante</label>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={teamSearchAway}
            onChange={(e) => setTeamSearchAway(e.target.value)}
            onFocus={() => setShowAwayDropdown(true)}
            onBlur={() => setTimeout(()=>setShowAwayDropdown(false),150)}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc', marginBottom:'5px' }}
          />
          {showAwayDropdown && (
            <ul style={{
              position:'absolute', top:'100%', left:0, right:0, maxHeight:'150px',
              overflowY:'auto', background:'white', border:'1px solid #ccc',
              borderRadius:'8px', margin:0, padding:0, listStyle:'none', zIndex:10
            }}>
              {teams.filter(t => t.name.toLowerCase().includes(teamSearchAway.toLowerCase()))
                .map(t => (
                  <li key={t.id} onClick={() => {
                    setForm({...form, away_team_id: t.id.toString()})
                    setTeamSearchAway(t.name)
                    setShowAwayDropdown(false)
                  }}
                    style={{ padding:'8px', cursor:'pointer' }}
                  >{t.name}</li>
                ))}
            </ul>
          )}
        </div>

        {['stake'].map(field => (
          <div key={field} style={{ marginTop:'10px' }}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="number"
              placeholder={field}
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({...form, [field]: e.target.value})}
              style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }}
            />
          </div>
        ))}

        {/* Botões */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'10px' }}>
          <button onClick={handleCancel} style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#e5e7eb', border:'none', cursor:'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}>Salvar</button>
        </div>

      </div>
    </div>
  )
}
