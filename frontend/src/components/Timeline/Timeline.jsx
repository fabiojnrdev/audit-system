import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

const ACTION_CONFIG = {
  CREATE: { color: '#38a169', bg: '#f0fff4', label: 'Criação', icon: '➕' },
  UPDATE: { color: '#3182ce', bg: '#ebf8ff', label: 'Atualização', icon: '✏️' },
  DELETE: { color: '#e53e3e', bg: '#fff5f5', label: 'Exclusão', icon: '🗑️' },
}

export default function Timeline({ logs }) {
  const navigate = useNavigate()

  if (!logs?.length) {
    return <div style={styles.empty}>Nenhum log encontrado.</div>
  }

  return (
    <div style={styles.container}>
      {logs.map((log) => {
        const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.UPDATE
        return (
          <div
            key={log.id}
            style={styles.item}
            onClick={() => navigate(`/events/${log.id}`)}
          >
            <div style={{ ...styles.dot, background: config.color }} />
            <div style={{ ...styles.card, borderLeft: `4px solid ${config.color}` }}>
              <div style={styles.cardHeader}>
                <span style={{ ...styles.actionBadge, background: config.bg, color: config.color }}>
                  {config.icon} {config.label}
                </span>
                <span style={styles.timestamp}>
                  {dayjs(log.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                </span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.object}>{log.object_repr}</span>
                <span style={styles.meta}>
                  {log.content_type} • {log.user || 'Sistema'} • {log.ip_address || '—'}
                </span>
              </div>
              {log.changes && Object.keys(log.changes).length > 0 && (
                <div style={styles.changesCount}>
                  {Object.keys(log.changes).length} campo(s) alterado(s) →
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '0' },
  empty: { textAlign: 'center', color: '#888', padding: '60px', background: '#fff', borderRadius: '12px' },
  item: { display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', position: 'relative', paddingBottom: '12px' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', marginTop: '18px', flexShrink: 0, zIndex: 1 },
  card: {
    flex: 1,
    background: '#fff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  actionBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  timestamp: { fontSize: '12px', color: '#999' },
  cardBody: { display: 'flex', flexDirection: 'column', gap: '4px' },
  object: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  meta: { fontSize: '12px', color: '#888' },
  changesCount: { marginTop: '8px', fontSize: '12px', color: '#3182ce', fontWeight: '600' },
}