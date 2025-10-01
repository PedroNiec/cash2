'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import BetModal from '@/components/BetModal'
import SettleBetModal from '@/components/SettleBetModal'


const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

type Bet = {
  id: string
  date: string
  market_id: number | null
  championship_id: number | null
  home_team_id: number | null
  away_team_id: number | null
  stake: number
  profit_loss: number | null
  percentage: number | null
  status: string | null
}

type Championship = { id: number; name: string }
type Team = { id: number; name: string }
type Market = { id: number; name: string }

export default function ApostasPage() {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)

  const [championships, setChampionships] = useState<Championship[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [markets, setMarkets] = useState<Market[]>([])

  // saldo da banca
  const [balance, setBalance] = useState<number | null>(null)

  const [showSettleModal, setShowSettleModal] = useState(false)
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)


  const championshipMap = Object.fromEntries(championships.map(c => [c.id, c.name]))
  const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]))
  const marketMap = Object.fromEntries(markets.map(m => [m.id, m.name]))

  const fetchData = async () => {
    setLoading(true)

    // Fetch apostas
    const { data: betsData, error: betsError } = await supabase
      .from<'bets', Bet>('bets')
      .select('*')
      .order('date', { ascending: false })
    if (betsError) console.error(betsError)
    else if (betsData) setBets(betsData)

    // Fetch campeonatos
    const { data: champsData } = await supabase.from('championships').select('*').order('name')
    if (champsData) setChampionships(champsData)

    // Fetch times
    const { data: teamsData } = await supabase.from('teams').select('*').order('name')
    if (teamsData) setTeams(teamsData)

    // Fetch mercados
    const { data: marketsData } = await supabase.from('markets').select('*').order('name')
    if (marketsData) setMarkets(marketsData)

    const { data: balanceData, error: balanceError } = await supabase.from('balance').select('balance').order('balance')

    if (balanceError) console.error(balanceError)
    else if (balanceData && balanceData.length > 0) setBalance(balanceData[0].balance)

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


  return (
    <div style={{ padding:'20px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', marginBottom:'10px' }}>Apostas</h1>

      <div style={{ marginBottom:'20px', fontSize:'1.2rem', fontWeight:'500' }}>
        Saldo da Banca: {balance !== null ? `R$ ${balance.toFixed(2)}` : 'Carregando...'}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <button
          onClick={handleNew}
          style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}
        >
          Nova Aposta
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
                {['Data','Mercado','Campeonato','Mandante','Visitante','R$ Stake','R$ Lucro','% Percentual','Status','Ações'].map(col => (
                  <th key={col} style={{ borderBottom:'2px solid #ccc', padding:'10px', textAlign:'left', background:'#f3f4f6' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bets.map(bet => (
                <tr key={bet.id} style={{ borderBottom:'1px solid #ddd' }}>
                  <td style={{ padding:'8px' }}>{new Date(bet.date).toLocaleString()}</td>
                  <td style={{ padding:'8px' }}>{marketMap[bet.market_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{championshipMap[bet.championship_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{teamMap[bet.home_team_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>{teamMap[bet.away_team_id || 0] || '-'}</td>
                  <td style={{ padding:'8px' }}>R$ {bet.stake}</td>
                  <td style={{ padding:'8px' }}>R$ {bet.profit_loss}</td>
                  <td style={{ padding:'8px' }}>{bet.percentage} %</td>
                  <td
                    style={{
                      padding: "8px",
                      fontWeight: "bold",
                      borderRadius:'6px',
                      backgroundColor:
                        bet.status === "green"
                        ? "#00990D"
                        : bet.status === "red"
                        ? "#DC143C"
                        : bet.status === "pending"
                        ? "#FFA500"
                        : "#000",
                      textAlign: 'center',
                      color: "#FFFAFA"
                    }}
                  >
                    {bet.status === "green"
                      ? "GREEN"
                      : bet.status === "red"
                      ? "RED"
                      : bet.status === "pending"
                      ? "PENDENTE"
                      : bet.status}
                  </td>
                  <td style={{ padding:'8px' }}>
                    {(!bet.status || bet.status === 'pending') && (
                      <button
                        onClick={() => handleSettle(bet)}
                        style={{ padding:'5px 10px', borderRadius:'6px', backgroundColor:'#10b981', color:'#fff', border:'none', cursor:'pointer', marginRight:'5px' }}
                      >
                        Fechar aposta
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(bet)}
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

      <BetModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false)
          fetchData()
        }}
        editingBet={editingBet ? { ...editingBet, status: editingBet.status || 'pending' } : null}
      />

      <SettleBetModal
        show={showSettleModal}
        bet={selectedBet}
        onClose={() => setShowSettleModal(false)}
        onSaved={() => {
          setShowSettleModal(false)
          fetchData()
        }}
      />

    </div>
  )
}
