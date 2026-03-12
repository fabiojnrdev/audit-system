import { useQuery } from '@tanstack/react-query'
import { getLogs } from '../services/auditService'

export const useAuditLogs = (filters = {}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => getLogs(filters).then((res) => res.data),
    staleTime: 30_000,
  })
}