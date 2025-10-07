'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Game = {
    id?: string
    date: string
    championship_id: number | null
    home_team_id: number | null
    away_team_id: number | null
    score_home: number | null
    score_away: number | null
    goals_home: string[]
    goals_away: string[]
  }
  

type GameModalProps = {
  show: boolean
  onClose: () => void
  onSave: () => void
  editingGame: Game | null
}

export default function GameModal({ show, onClose, onSave, editingGame }: GameModalProps) {
  const now = new Date()
  const formattedDate = now.toISOString().slice(0,16)

  const [form, setForm] = useState<Game>({
    date: formattedDate,
    championship_id: null,
    home_team_id: null,
    away_team_id: null,
    score_home: 0,
    score_away: 0,
    goals_home: [],
    goals_away: []
  })

  const [championships, setChampionships] = useState<{ id: number; name: string }[]>([])
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([])

  const [champSearch, setChampSearch] = useState('')
  const [teamSearchHome, setTeamSearchHome] = useState('')
  const [teamSearchAway, setTeamSearchAway] = useState('')

  const [showChampDropdown, setShowChampDropdown] = useState(false)
  const [showHomeDropdown, setShowHomeDropdown] = useState(false)
  const [showAwayDropdown, setShowAwayDropdown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: champs } = await supabase.from('championships').select('*').order('name')
      if (champs) setChampionships(champs)

      const { data: teamsData } = await supabase.from('teams').select('*').order('name')
      if (teamsData) setTeams(teamsData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (editingGame) {
      setForm(editingGame)
      setChampSearch(championships.find(c => c.id === editingGame.championship_id)?.name || '')
      setTeamSearchHome(teams.find(t => t.id === editingGame.home_team_id)?.name || '')
      setTeamSearchAway(teams.find(t => t.id === editingGame.away_team_id)?.name || '')
    } else {
      resetForm()
    }
  }, [editingGame, championships, teams])

  const resetForm = () => {
    setForm({
      date: formattedDate,
      championship_id: null,
      home_team_id: null,
      away_team_id: null,
      score_home: 0,
      score_away: 0,
      goals_home: [],
      goals_away: []
    })
    setChampSearch('')
    setTeamSearchHome('')
    setTeamSearchAway('')
  }

  const handleSave = async () => {
    const payload = {
      date: form.date || new Date().toISOString(),
      championship_id: form.championship_id,
      home_team_id: form.home_team_id,
      away_team_id: form.away_team_id,
      score_home: form.score_home,
      score_away: form.score_away,
      goals_home: form.goals_home,
      goals_away: form.goals_away
    }

    if (editingGame?.id) {
      await supabase.from('games').update(payload).eq('id', editingGame.id)
    } else {
      await supabase.from('games').insert([payload])
    }

    resetForm()
    onSave()
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const addGoal = (team: 'home' | 'away') => {
    if (team === 'home') setForm({...form, goals_home: [...form.goals_home, '']})
    else setForm({...form, goals_away: [...form.goals_away, '']})
  }

  const removeGoal = (team: 'home' | 'away', index: number) => {
    if (team === 'home') setForm({...form, goals_home: form.goals_home.filter((_, i) => i !== index)})
    else setForm({...form, goals_away: form.goals_away.filter((_, i) => i !== index)})
  }

  const updateGoal = (team: 'home' | 'away', index: number, value: string) => {
    if (team === 'home') {
      const newGoals = [...form.goals_home]
      newGoals[index] = value
      setForm({...form, goals_home: newGoals})
    } else {
      const newGoals = [...form.goals_away]
      newGoals[index] = value
      setForm({...form, goals_away: newGoals})
    }
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
          {editingGame ? 'Editar Jogo' : 'Novo Jogo'}
        </h2>

        {/* Data */}
        <div>
          <label>Data/Hora</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }}
          />
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
                    setForm({...form, championship_id: c.id})
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
                    setForm({...form, home_team_id: t.id})
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
                    setForm({...form, away_team_id: t.id})
                    setTeamSearchAway(t.name)
                    setShowAwayDropdown(false)
                  }}
                    style={{ padding:'8px', cursor:'pointer' }}
                  >{t.name}</li>
                ))}
            </ul>
          )}
        </div>

        {/* Placar */}
        <div style={{ display:'flex', gap:'10px', marginTop:'10px' }}>
          <div style={{ flex:1 }}>
            <label>Placar Mandante</label>
            <input type="number" value={form.score_home ?? 0} onChange={(e) => setForm({...form, score_home: parseInt(e.target.value)})} style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }} />
          </div>
          <div style={{ flex:1 }}>
            <label>Placar Visitante</label>
            <input type="number" value={form.score_away ?? 0} onChange={(e) => setForm({...form, score_away: parseInt(e.target.value)})} style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ccc' }} />
          </div>
        </div>

        {/* Gols Mandante */}
        <div>
          <label>Minutos gol Mandante</label>
          {form.goals_home.map((goal, i) => (
            <div key={i} style={{ display:'flex', gap:'10px', marginBottom:'5px' }}>
              <input type="number" value={goal} onChange={(e) => updateGoal('home', i, e.target.value)} style={{ flex:1, padding:'8px', borderRadius:'6px', border:'1px solid #ccc' }} />
              <button onClick={() => removeGoal('home', i)} style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#ef4444', color:'#fff', border:'none', cursor:'pointer' }}>Remover</button>
            </div>
          ))}
          <button onClick={() => addGoal('home')} style={{ marginTop:'5px', padding:'8px 12px', borderRadius:'6px', backgroundColor:'#3b82f6', color:'#fff', border:'none', cursor:'pointer' }}>Adicionar Gol Mandante</button>
        </div>

        {/* Gols Visitante */}
        <div>
          <label>Minutos gol Visitante</label>
          {form.goals_away.map((goal, i) => (
            <div key={i} style={{ display:'flex', gap:'10px', marginBottom:'5px' }}>
              <input type="number" value={goal} onChange={(e) => updateGoal('away', i, e.target.value)} style={{ flex:1, padding:'8px', borderRadius:'6px', border:'1px solid #ccc' }} />
              <button onClick={() => removeGoal('away', i)} style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#ef4444', color:'#fff', border:'none', cursor:'pointer' }}>Remover</button>
            </div>
          ))}
          <button onClick={() => addGoal('away')} style={{ marginTop:'5px', padding:'8px 12px', borderRadius:'6px', backgroundColor:'#f472b6', color:'#fff', border:'none', cursor:'pointer' }}>Adicionar Gol Visitante</button>
        </div>

        {/* Botões */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', marginTop:'10px' }}>
          <button onClick={handleCancel} style={{ padding:'10px 15px', borderRadius:'8px', border:'1px solid #ccc', background:'#fff', cursor:'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding:'10px 15px', borderRadius:'8px', border:'none', background:'#10b981', color:'#fff', cursor:'pointer' }}>{editingGame ? 'Salvar' : 'Criar'}</button>
        </div>
      </div>
    </div>
  )
}
