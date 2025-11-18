'use client'

import { useState } from 'react'
import FecharDiaModal from '@/components/FecharDiaModal'
import FechamentosGrid from '@/components/FechamentosGrid'
import FechamentoViewModal from '@/components/FechamentoViewModal'
import { Plus, TrendingUp, Target } from 'lucide-react'

interface Fechamento {
  id: string
  date: string
  m1_lucro: number
  m1_ops: number
  m2_lucro: number
  m2_ops: number
  m3_lucro: number
  m3_ops: number
  total_dia: number
  pct_meta: number
  delta_meta: number
  status: string
  observacoes: string | null
  reconciled_cash: number | null
  attachments: any[]
  provisioned: boolean
}

export default function FecharDiaPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedFechamento, setSelectedFechamento] = useState<Fechamento | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [hoveredButton, setHoveredButton] = useState(false)

  const handleCreateClick = () => {
    setShowCreateModal(true)
  }

  const handleCreateSave = () => {
    setShowCreateModal(false)
    setRefreshKey(prev => prev + 1)
  }

  const handleView = (fechamento: Fechamento) => {
    setSelectedFechamento(fechamento)
    setShowViewModal(true)
  }

  const handleViewClose = () => {
    setShowViewModal(false)
    setSelectedFechamento(null)
  }

  const handleViewUpdate = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Target size={40} style={{ color: '#8b5cf6' }} />
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#fff',
              margin: 0
            }}>
              Fechamento Diário
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            Controle completo dos resultados diários com metas e análises
          </p>
        </div>

        {/* Action Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleCreateClick}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: hoveredButton 
                 ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                 : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: hoveredButton 
                ? '0 10px 30px rgba(139, 92, 246, 0.4)'
                : '0 4px 15px rgba(139, 92, 246, 0.3)',
              transform: hoveredButton ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            <Plus size={20} />
            Novo Fechamento
          </button>
        </div>

        {/* Grid */}
        <FechamentosGrid
          onView={handleView}
          refresh={refreshKey}
        />

        {/* Modals */}
        <FecharDiaModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSave}
        />

        <FechamentoViewModal
          show={showViewModal}
          onClose={handleViewClose}
          fechamento={selectedFechamento}
          onUpdate={handleViewUpdate}
        />
      </div>
    </div>
  )
}