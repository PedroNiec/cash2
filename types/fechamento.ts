// types/fechamento.ts
export interface Fechamento {
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