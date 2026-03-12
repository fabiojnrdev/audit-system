export default function DiffViewer({ changes }) {
  if (!changes || Object.keys(changes).length === 0) {
    return <p style={styles.empty}>Nenhuma alteração registrada.</p>
  }

  return (
    <div style={styles.container}>
      {Object.entries(changes).map(([field, { before, after }]) => (
        <div key={field} style={styles.row}>
          <div style={styles.fieldName}>{field}</div>
          <div style={styles.values}>
            <div style={styles.before}>
              <span style={styles.label}>Antes</span>
              <code style={styles.code}>{before ?? 'null'}</code>
            </div>
            <div style={styles.arrow}>→</div>
            <div style={styles.after}>
              <span style={styles.label}>Depois</span>
              <code style={styles.code}>{after ?? 'null'}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px' },
  row: { border: '1px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden' },
  fieldName: { background: '#f7f8fc', padding: '8px 14px', fontSize: '12px', fontWeight: '700', color: '#555', borderBottom: '1px solid #e8e8e8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  values: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', alignItems: 'center' },
  before: { padding: '12px 14px', background: '#fff5f5' },
  after: { padding: '12px 14px', background: '#f0fff4' },
  arrow: { padding: '0 12px', fontSize: '18px', color: '#999', textAlign: 'center' },
  label: { display: 'block', fontSize: '11px', color: '#999', marginBottom: '4px', fontWeight: '600' },
  code: { fontSize: '13px', color: '#1a1a2e', wordBreak: 'break-all', fontFamily: 'monospace' },
}