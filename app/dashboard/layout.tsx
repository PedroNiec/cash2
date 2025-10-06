'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() // para destacar o menu ativo

  const menuItems = [
    { label: 'Geral', path: '/dashboard' },
    { label: 'Apostas', path: '/dashboard/apostas' },
    { label: 'Configurações', path: '/dashboard/configuracoes' },
    // { label: 'Rotina', path: '/dashboard/rotina', readOnly: true },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <aside
        style={{
          width: '250px',
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
          Dashboard
        </h1>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: pathname === item.path ? '#334155' : 'transparent',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: pathname === item.path ? 'bold' : 'normal',
                transition: 'background 0.3s',
              }}
              onMouseOver={(e) => {
                if (pathname !== item.path) e.currentTarget.style.backgroundColor = '#475569'
              }}
              onMouseOut={(e) => {
                if (pathname !== item.path) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Área de conteúdo */}
      <main
        style={{
          flex: 1,
          padding: '30px',
          backgroundColor: '#f8fafc',
        }}
      >
        {children}
      </main>
    </div>
  )
}
