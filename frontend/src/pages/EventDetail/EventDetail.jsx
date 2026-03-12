import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLogById } from '../../services/auditService'
import DiffViewer from '../../components/DiffViewer/DiffViewer'
import dayjs from 'dayjs'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: log, isLoading, isError } = useQuery({
    queryKey: ['audit-log', id],
    queryFn: () => getLogById(id).then((res) => res.data),
  })

  if (isLoading) return <div style={styles.center}>Carregando...</div>
  if (isError) return <div style={styles.center}>Erro ao carregar evento.</div>

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Voltar</button>
        <h1 style={styles.title}>Detalhe do Evento #{log.id}</h1>
      </header>

      <div style={styles.grid}>
        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Informações</h3>
          <InfoRow label="Ação" value={log.action_display} />
          <InfoRow label="Objeto" value={log.object_repr} />
          <InfoRow label="Tipo" value={log.content_type} />
          <InfoRow label="ID do Objeto" value={log.object_id} />
          <InfoRow label="Usuário" value={log.user || 'Sistema'} />
          <InfoRow label="IP" value={log.ip_address || '—'} />
          <InfoRow label="Data/Hora" value={dayjs(log.timestamp).format('DD/MM/YYYY HH:mm:ss')} />
        </div>

        <div style={styles.diffCard}>
          <h3 style={styles.cardTitle}>Alterações</h3>
          <DiffViewer changes={log.changes} />
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({ label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.infoLabel}>{label}</span>
    <span style={styles.infoValue}>{value}</span>
  </div>
)

const styles = {
  container: { minHeight: '100vh', background: '#f7f8fc', fontFamily: 'system-ui, sans-serif' },
  header: { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  title: { margin: 0, fontSize: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', padding: '32px' },
  infoCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignSelf: 'start' },
  diffCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 16px', fontSize: '16px', color: '#1a1a2e', borderBottom: '2px solid #f0f0f0', paddingBottom: '12px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  infoLabel: { fontSize: '13px', color: '#888', fontWeight: '600' },
  infoValue: { fontSize: '13px', color: '#1a1a2e', fontWeight: '500', textAlign: 'right', maxWidth: '60%' },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '18px', color: '#666' },
}