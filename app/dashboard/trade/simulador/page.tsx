'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import GameModal from '@/components/GameModal' // vamos integrar depois

const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Championship = { id: number; name: string }
type Team = { id: number; name: string }
type Game = {
  id: string
  date: string
  championship_id: number | null
  home_team_id: number | null
  away_team_id: number | null
  score_home: number | null
  score_away: number | null
  goals_home: string[] // array de minutos dos gols
  goals_away: string[] // array de minutos dos gols
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  const [championships, setChampionships] = useState<Championship[]>([])
  const [teams, setTeams] = useState<Team[]>([])

  // Map para facilitar exibição de nomes
  const championshipMap = Object.fromEntries(championships.map(c => [c.id, c.name]))
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]))

  const fetchData = async () => {
    setLoading(true)

    const { data: gamesData, error: gamesError } = await supabase
      .from<'games', Game>('games')
      .select('*')
      .order('date', { ascending: false })
    if (gamesError) console.error(gamesError)
    else if (gamesData) setGames(gamesData)

    const { data: champsData } = await supabase.from('championships').select('*').order('name')
    if (champsData) setChampionships(champsData)

    const { data: teamsData } = await supabase.from('teams').select('*').order('name')
    if (teamsData) setTeams(teamsData)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNew = () => {
    setEditingGame(null)
    setShowModal(true)
  }

  const handleEdit = (game: Game) => {
    setEditingGame(game)
    setShowModal(true)
  }

  return (
    <div style={{ padding:'20px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', marginBottom:'10px' }}>Jogos Registrados</h1>

      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <button
          onClick={handleNew}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Novo Jogo
        </button>
        <button
          onClick={fetchData}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#64748b', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Data','Campeonato','Mandante','Visitante','Placar','Gols Mandante','Gols Visitante','Ações'].map(col => (
                  <th key={col} style={{ borderBottom:'2px solid #ccc', padding:'10px', textAlign:'left', background:'#f3f4f6' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id} style={{ borderBottom:'1px solid #ddd' }}>
                  <td style={{ padding:'8px' }}>{new Date(game.date).toLocaleString()}</td>
                  <td style={{ padding:'8px' }}>{championshipMap[game.championship_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{teamMap[game.home_team_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{teamMap[game.away_team_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{game.score_home != null && game.score_away != null ? `${game.score_home} x ${game.score_away}` : '-'}</td>
                  <td style={{ padding:'8px' }}>{game.goals_home?.join(', ') || '-'}</td>
                  <td style={{ padding:'8px' }}>{game.goals_away?.join(', ') || '-'}</td>
                  <td style={{ padding:'8px' }}>
                    <button
                      onClick={() => handleEdit(game)}
                      style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#fbbf24', border:'none', cursor:'pointer' }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GameModal
        show={showModal}
        editingGame={editingGame}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false)
          fetchData()
        }}
      />
    </div>
  )
}
