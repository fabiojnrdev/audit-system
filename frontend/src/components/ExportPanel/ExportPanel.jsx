import { exportCSV, exportPDF } from '../../services/auditService'

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportPanel({ filters }) {
  const handleCSV = async () => {
    try {
      const res = await exportCSV(filters)
      downloadBlob(res.data, 'audit_log.csv')
    } catch {
      alert('Erro ao exportar CSV')
    }
  }

  const handlePDF = async () => {
    try {
      const res = await exportPDF(filters)
      downloadBlob(res.data, 'audit_log.pdf')
    } catch {
      alert('Erro ao exportar PDF')
    }
  }

  return (
    <div style={styles.container}>
      <span style={styles.label}>Exportar:</span>
      <button style={styles.csvBtn} onClick={handleCSV}>⬇ CSV</button>
      <button style={styles.pdfBtn} onClick={handlePDF}>⬇ PDF</button>
    </div>
  )
}

const styles = {
  container: { display: 'flex', alignItems: 'center', gap: '10px' },
  label: { fontSize: '14px', color: '#666', fontWeight: '600' },
  csvBtn: { padding: '10px 18px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  pdfBtn: { padding: '10px 18px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
}