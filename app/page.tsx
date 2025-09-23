// pages/teste.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TesteSupabase() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('*')
      if (error) console.error(error)
      else setUsers(data)
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email}</li>
          
        ))}
      </ul>
    </div>
  )
}
