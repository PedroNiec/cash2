import TotalBetsCard from '../../components/TotalBetsCard'
import ProfitLossCard from '../../components/ProfitLossCard'
import TotalBankCard from '../../components/TotalBank'
import WeeklyPLChart from '../../components/WeeklyPLChart'
import MethodsCard from '../../components/MethodsCard'
import TotalGreensCard from '@/components/TotalGreensBets'
import TotalRedsCard from '@/components/TotalRedsBets'

export default function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
        radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
      `,
      backgroundBlendMode: 'overlay, overlay, overlay, normal',
      backgroundAttachment: 'fixed, fixed, fixed, fixed',
      backgroundPosition: 'center, center, center, center',
      backgroundSize: 'cover, 256px 256px, cover, cover',
      backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat',
      padding: '40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 220px)',
      gap: '24px',
      justifyContent: 'center',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <TotalBetsCard />
      <ProfitLossCard />
      <TotalBankCard />
      <TotalGreensCard />
      <TotalRedsCard />
      <MethodsCard />
      <WeeklyPLChart />
    </div>
  )
}