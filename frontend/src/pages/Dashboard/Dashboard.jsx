import { useState } from 'react'
import { useAuditLogs } from '../../hooks/useAuditLogs'
import { useAuth } from '../../hooks/useAuth'
import Filters from '../../components/Filters/Filters'
import Timeline from '../../components/Timeline/Timeline'
import ExportPanel from '../../components/ExportPanel/ExportPanel'

export default function Dashboard() {
  const [filters, setFilters] = useState({})
  const { data, isLoading, isError } = useAuditLogs(filters)
  const { user, logout } = useAuth()

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>🔐 Audit System</h1>
          <span style={styles.badge}>Dashboard</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.username}>👤 {user?.username}</span>
          <button style={styles.logoutBtn} onClick={logout}>Sair</button>
        </div>
      </header>

      <main style={styles.main} className="main-content">
        <div style={styles.topBar}>
          <Filters onFilter={setFilters} />
          <ExportPanel filters={filters} />
        </div>

        <div style={styles.stats} className="stats-grid">
          <StatCard label="Total de Logs" value={data?.count ?? '—'} color="#1a1a2e" />
          <StatCard label="Criações" value={data?.count_by_action?.CREATE ?? '—'} color="#38a169" />
          <StatCard label="Atualizações" value={data?.count_by_action?.UPDATE ?? '—'} color="#3182ce" />
          <StatCard label="Exclusões" value={data?.count_by_action?.DELETE ?? '—'} color="#e53e3e" />
        </div>

        {isLoading && <p style={styles.info}>Carregando logs...</p>}
        {isError && <p style={styles.error}>Erro ao carregar logs.</p>}
        {data && <Timeline logs={data.results} />}
      </main>
    </div>
  )
}

const StatCard = ({ label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <p style={styles.statValue}>{value}</p>
    <p style={styles.statLabel}>{label}</p>
  </div>
)

const styles = {
  container: { minHeight: '100vh', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    color: '#fff',
    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { margin: 0, fontSize: '20px' },
  badge: {
    background: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { fontSize: '14px', opacity: 0.9 },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  main: { padding: 'clamp(16px, 3vw, 32px)' },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statValue: { margin: 0, fontSize: '32px', fontWeight: '700', color: '#1a1a2e' },
  statLabel: { margin: '4px 0 0', fontSize: '13px', color: '#888' },
  info: { textAlign: 'center', color: '#666', padding: '40px' },
  error: { textAlign: 'center', color: '#e53e3e', padding: '40px' },
}