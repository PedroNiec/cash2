'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  const [returnedValue, setReturnedValue] = useState<string>('') // começa vazio
  const [percentage, setPercentage] = useState<number>(0)

  useEffect(() => {
    if (bet) {
      setReturnedValue(
        bet.profit_loss !== null && bet.profit_loss !== undefined
          ? String(bet.profit_loss)
          : ''
      )
      setPercentage(bet.stake && bet.profit_loss ? (bet.profit_loss / bet.stake) * 100 : 0)
      setResult('green')
    }
  }, [bet])

  useEffect(() => {
    if (bet && returnedValue !== '') {
      const numericValue = parseFloat(returnedValue)
      setPercentage(bet.stake ? (numericValue / bet.stake) * 100 : 0)
    }
  }, [returnedValue, bet])

  if (!show || !bet) return null

  const handleSave = async () => {
  if (returnedValue === '') {
    alert('Preencha o valor retornado antes de salvar.')
    return
  }

  const numericValue = parseFloat(returnedValue)
  const absValue = Math.abs(numericValue) // garante positivo

  await supabase
    .from('bets')
    .update({
      status: result,
      profit_loss: result === 'green' ? absValue : -absValue,
      percentage: percentage
    })
    .eq('id', bet.id)

  const { data: balanceData } = await supabase.from('balance').select('*').limit(1)
  if (balanceData && balanceData.length > 0) {
    let currentBalance = balanceData[0].balance || 0
    currentBalance += result === 'green' ? absValue : -absValue
    await supabase.from('balance').update({ balance: currentBalance }).eq('id', balanceData[0].id)
  }

  onSaved()
}


  return (
    <div style={{
      position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
      backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center',
      alignItems:'center', padding:'20px', zIndex:50
    }}>
      <div style={{
        backgroundColor:'white', borderRadius:'15px', width:'100%', maxWidth:'400px',
        padding:'20px', display:'flex', flexDirection:'column', gap:'15px'
      }}>
        <h2 style={{ fontSize:'1.5rem', fontWeight:'bold' }}>Fechar Aposta</h2>

        <div>
          <label>Resultado</label>
          <select value={result} onChange={(e) => setResult(e.target.value as 'green' | 'red')}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc' }}
          >
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        </div>

        <label>Valor Retornado</label>
        <input
          type="number" 
          value={returnedValue}
          onChange={(e) => setReturnedValue(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
        />

        <div>
          <label>Percentual (%)</label>
          <input
            type="number"
            value={returnedValue !== '' 
              ? (parseFloat(returnedValue) >= 0 
                  ? percentage.toFixed(2) 
                  : (percentage * -1).toFixed(2)) 
              : ''}
            readOnly
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'1px solid #ccc', background:'#f3f4f6' }}
          />
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#e5e7eb', border:'none', cursor:'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding:'10px 20px', borderRadius:'8px', backgroundColor:'#4f46e5', color:'#fff', border:'none', cursor:'pointer' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
