'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulação de login (substitua por Supabase se quiser)
    setTimeout(() => {
      if (email === 'teste@teste.com' && password === '123') {
        router.push('/dashboard')
      } else {
        setError('Email ou senha incorretos')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.7); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
        `,
        backgroundBlendMode: 'overlay, overlay, overlay, normal',
        backgroundAttachment: 'fixed, fixed, fixed, fixed',
        backgroundSize: 'cover, 256px 256px, cover, cover',
        backgroundPosition: 'center, center, center, center',
        backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat',
      }}>
        {/* Card de Login com Glassmorphism */}
        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '36px',
            borderRadius: '24px',
            background: 'rgba(31, 41, 55, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(75, 85, 99, 0.4)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.15)',
            animation: 'fadeIn 0.7s ease-out, float 6s ease-in-out infinite',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          } as React.CSSProperties}
        >
          {/* Ícone com Glow Animado */}
          <div style={{
            width: '82px',
            height: '82px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.6), 0 8px 20px rgba(16, 185, 129, 0.4)',
            animation: 'pulse 3s ease-in-out infinite'
          }}>
            <LogIn size={42} style={{ color: '#fff' }} />
          </div>

          <h1 style={{
            margin: 0,
            fontSize: '1.9rem',
            fontWeight: 700,
            color: '#e2e8f0',
            letterSpacing: '-0.025em'
          }}>
            Login
          </h1>

          <p style={{
            margin: '0 0 20px',
            fontSize: '0.9rem',
            color: '#94a3b8',
            textAlign: 'center'
          }}>
            Acesse seu dashboard de apostas
          </p>

          {/* Email */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Mail size={19} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                borderRadius: '14px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(17, 24, 39, 0.8)',
                color: '#e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.25s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.5)'}
            />
          </div>

          {/* Senha */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Lock size={19} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                borderRadius: '14px',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                background: 'rgba(17, 24, 39, 0.8)',
                color: '#e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.25s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(75, 85, 99, 0.5)'}
            />
          </div>

          {/* Erro */}
          {error && (
            <p style={{
              margin: '8px 0 0',
              fontSize: '0.875rem',
              color: '#fca5a5',
              textAlign: 'center',
              fontWeight: 500
            }}>
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              background: loading ? '#059669' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
              opacity: loading ? 0.85 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <>Carregando...</>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>

          <p style={{
            margin: '28px 0 0',
            fontSize: '0.8rem',
            color: '#64748b',
            textAlign: 'center'
          }}>
            © 2025 Cein Trading System
          </p>
        </form>
      </div>
    </>
  )
}