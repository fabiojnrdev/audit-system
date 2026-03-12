import { useState } from 'react'

const ACTION_OPTIONS = [
  { value: '', label: 'Todas as ações' },
  { value: 'CREATE', label: 'Criação' },
  { value: 'UPDATE', label: 'Atualização' },
  { value: 'DELETE', label: 'Exclusão' },
]

export default function Filters({ onFilter }) {
  const [action, setAction] = useState('')
  const [search, setSearch] = useState('')

  const handleApply = () => {
    onFilter({
      ...(action && { action }),
      ...(search && { search }),
    })
  }

  const handleClear = () => {
    setAction('')
    setSearch('')
    onFilter({})
  }

  return (
    <div style={styles.container} className="filters-container">
      <select style={styles.select} value={action} onChange={(e) => setAction(e.target.value)}>
        {ACTION_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        style={styles.input}
        type="text"
        placeholder="Buscar por objeto ou usuário..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />

      <button style={styles.btnPrimary} onClick={handleApply}>Filtrar</button>
      <button style={styles.btnSecondary} onClick={handleClear}>Limpar</button>
    </div>
  )
}

const styles = {
  container: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', background: '#fff', cursor: 'pointer' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', width: '280px', maxWidth: '100%' },
  btnPrimary: { padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  btnSecondary: { padding: '10px 20px', background: '#fff', color: '#666', border: '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
}