// app/teste/page.tsx
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TesteSupabase() {
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  return (
    <div>
      <h1>Página de Teste</h1>
      <p>Se você não estiver logado, será redirecionado.</p>
    </div>
  )
}
