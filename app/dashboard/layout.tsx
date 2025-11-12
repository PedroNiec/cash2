'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp, Home, BarChart3, Settings, Clock, DollarSign, FileText, TrendingUp } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const menuItems = [
    { label: 'Geral', path: '/dashboard', icon: Home },
    { label: 'Apostas', path: '/dashboard/apostas', icon: BarChart3 },
    { label: 'Configurações', path: '/dashboard/configuracoes', icon: Settings },
    { label: 'Rotina', path: '/dashboard/rotina', icon: Clock },
    { label: 'Trade', path: '/dashboard/trade/simulador', icon: TrendingUp },
  ]

  const financeiroSubItems = [
    { label: 'Contas a Receber', path: '/dashboard/financeiro/cre', icon: DollarSign },
    { label: 'Contas a Pagar', path: '/dashboard/financeiro/cpa', icon: FileText },
    { label: 'Dashboard', path: '/dashboard/financeiro/dash', icon: BarChart3 },
  ]

  const isFinanceiroActive = financeiroSubItems.some(item => item.path === pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        @keyframes slideUp {
          from { opacity: 1; max-height: 200px; }
          to { opacity: 0; max-height: 0; }
        }
      `}</style>

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
          borderRight: '1px solid rgba(75, 85, 99, 0.3)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 0 30px rgba(0, 0, 0, 0.4)',
          zIndex: 50,
        }}
      >
        {/* Logo / Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <TrendingUp size={26} style={{ color: '#fff' }} />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: '-0.025em'
          }}>
            Dashboard
          </h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {/* Itens principais */}
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: isActive
                    ? 'rgba(16, 185, 129, 0.15)'
                    : (hoveredItem === item.path ? 'rgba(16, 185, 129, 0.08)' : 'transparent'),
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  color: isActive ? '#10b981' : '#e2e8f0',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  transform: hoveredItem === item.path && !isActive ? 'translateX(2px)' : 'translateX(0)',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                    : (hoveredItem === item.path ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none')
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Dropdown Financeiro */}
          <div>
            <button
              onClick={() => setIsFinanceiroOpen(!isFinanceiroOpen)}
              onMouseEnter={() => setHoveredItem('financeiro')}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '10px',
                background: isFinanceiroActive
                  ? 'rgba(16, 185, 129, 0.15)'
                  : (hoveredItem === 'financeiro' ? 'rgba(16, 185, 129, 0.08)' : 'transparent'),
                border: isFinanceiroActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                color: isFinanceiroActive ? '#10b981' : '#e2e8f0',
                fontWeight: isFinanceiroActive ? '600' : '500',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                transform: hoveredItem === 'financeiro' && !isFinanceiroActive ? 'translateX(2px)' : 'translateX(0)',
                boxShadow: isFinanceiroActive
                  ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                  : (hoveredItem === 'financeiro' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DollarSign size={18} />
                <span>Financeiro</span>
              </div>
              {isFinanceiroOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Subitens com animação */}
            <div
              style={{
                overflow: 'hidden',
                animation: isFinanceiroOpen ? 'slideDown 0.3s ease-out' : 'slideUp 0.3s ease-out',
                maxHeight: isFinanceiroOpen ? '200px' : '0',
                opacity: isFinanceiroOpen ? 1 : 0,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '48px' }}>
                {financeiroSubItems.map((subItem) => {
                  const SubIcon = subItem.icon
                  const isActive = pathname === subItem.path
                  return (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      onMouseEnter={() => setHoveredItem(subItem.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: isActive
                          ? 'rgba(16, 185, 129, 0.2)'
                          : (hoveredItem === subItem.path ? 'rgba(16, 185, 129, 0.1)' : 'transparent'),
                        border: isActive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                        color: isActive ? '#10b981' : '#cbd5e1',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? '600' : '500',
                        transition: 'all 0.2s ease',
                        transform: hoveredItem === subItem.path && !isActive ? 'translateX(1px)' : 'translateX(0)',
                        boxShadow: isActive ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                      }}
                    >
                      <SubIcon size={16} />
                      <span>{subItem.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Footer opcional */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(75, 85, 99, 0.3)',
          fontSize: '0.75rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          © 2025 Dashboard
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main
        style={{
          flex: 1,
          padding: '32px',
          background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  )
}