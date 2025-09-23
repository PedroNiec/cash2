import TotalBetsCard from '../../components/TotalBetsCard'
import ProfitLossCard from '../../components/ProfitLossCard'
import TotalBankCard from '../../components/TotalBank'
import WeeklyPLChart from '../../components/WeeklyPLChart'
import MethodsCard from '../../components/MethodsCard'
import TotalGreensCard from '@/components/TotalGreensBets'
import TotalRedsCard from '@/components/TotalRedsBets'


export default function DashboardPage() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      <TotalBetsCard />
      <ProfitLossCard />
      <TotalBankCard />
      <TotalGreensCard/>
      <TotalRedsCard/>
      <WeeklyPLChart />
      <MethodsCard />
    </div>
  )
}
