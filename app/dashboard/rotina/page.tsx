'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://ytiyrfliszifyuhghiqg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aXlyZmxpc3ppZnl1aGdoaXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTYzNjIsImV4cCI6MjA3Mzg5MjM2Mn0.DRmIJ0hee4kX7wdXt2OMXhaJ6-9RG6wL5FKZTw5hOz4'
const supabase = createClient(supabaseUrl, supabaseKey)

interface PointRecord {
  id: number
  timestamp: string
  type: 'entrada' | 'saida'
}

interface Shift {
  entrada: PointRecord
  saida: PointRecord
  duracao: string
}

export default function Page() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [records, setRecords] = useState<PointRecord[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [nextType, setNextType] = useState<'entrada' | 'saida'>('entrada')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('points')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Erro ao buscar registros:', error)
        return
      }

      if (data) {
        setRecords(data)
        calculateShifts(data)
        if (data.length > 0) {
          const lastType = data[0].type
          setNextType(lastType === 'entrada' ? 'saida' : 'entrada')
        }
      }
    } catch (error) {
      console.error('Erro ao buscar registros:', error)
    }
  }

  const calculateShifts = (records: PointRecord[]) => {
    const calculatedShifts: Shift[] = []
    
    const sortedRecords = [...records].reverse()
    
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const current = sortedRecords[i]
      const next = sortedRecords[i + 1]
      
      if (current.type === 'entrada' && next.type === 'saida') {
        const entradaTime = new Date(current.timestamp)
        const saidaTime = new Date(next.timestamp)
        const diffMs = saidaTime.getTime() - entradaTime.getTime()
        
        calculatedShifts.push({
          entrada: current,
          saida: next,
          duracao: formatDuration(diffMs)
        })
        
        i++
      }
    }
    
    setShifts(calculatedShifts.reverse())
  }

  const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const handleRegisterPoint = async () => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('points')
        .insert([
          {
            timestamp: new Date().toISOString(),
            type: nextType
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao registrar ponto:', error)
        alert('Erro ao registrar ponto. Verifique o console.')
        setLoading(false)
        return
      }

      await fetchRecords()
      
      setNextType(nextType === 'entrada' ? 'saida' : 'entrada')
    } catch (error) {
      console.error('Erro ao registrar ponto:', error)
      alert('Erro ao registrar ponto. Verifique o console.')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const formatCurrentTime = (): string => {
    if (!currentTime) return '--/--/---- --:--:--'
    return formatDateTime(currentTime.toISOString())
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Controle de Ponto</h1>

        <div style={styles.clock}>{formatCurrentTime()}</div>

        <button
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          onClick={handleRegisterPoint}
          disabled={loading}
        >
          {loading
            ? 'Registrando...'
            : `Registrar ${nextType === 'entrada' ? 'Entrada' : 'Saída'}`}
        </button>

        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Turnos e Tempo Trabalhado</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Entrada</th>
                <th style={styles.tableHeader}>Saída</th>
                <th style={styles.tableHeader}>Tempo Trabalhado</th>
              </tr>
            </thead>
            <tbody>
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan={3} style={styles.emptyMessage}>
                    Nenhum turno completo encontrado
                  </td>
                </tr>
              ) : (
                shifts.map((shift, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      {formatDateTime(shift.entrada.timestamp)}
                    </td>
                    <td style={styles.tableCell}>
                      {formatDateTime(shift.saida.timestamp)}
                    </td>
                    <td style={{...styles.tableCell, ...styles.durationCell}}>
                      {shift.duracao}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>Histórico de Registros</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Data e Hora</th>
                <th style={styles.tableHeader}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={2} style={styles.emptyMessage}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      {formatDateTime(record.timestamp)}
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(record.type === 'entrada'
                            ? styles.badgeEntrada
                            : styles.badgeSaida),
                        }}
                      >
                        {record.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    fontSize: '32px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  clock: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#666',
    marginBottom: '30px',
    fontWeight: '500',
  },
  button: {
    display: 'block',
    margin: '0 auto 40px',
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  tableContainer: {
    marginTop: '20px',
  },
  tableTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #e5e7eb',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '12px',
    color: '#4b5563',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
  },
  badgeEntrada: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgeSaida: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  durationCell: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: '16px',
  },
}