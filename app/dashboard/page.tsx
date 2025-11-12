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
      gridTemplateColumns: 'repeat(auto-fit, 220px)',
      gap: '24px',
      justifyContent: 'center',
      padding: '40px 20px',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 100px)'
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
