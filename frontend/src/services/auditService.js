import api from './api'

export const getLogs = (params = {}) =>
  api.get('/audit/logs/', { params })

export const getLogById = (id) =>
  api.get(`/audit/logs/${id}/`)

export const exportCSV = (params = {}) =>
  api.get('/exports/csv/', {
    params,
    responseType: 'blob',
  })

export const exportPDF = (params = {}) =>
  api.get('/exports/pdf/', {
    params,
    responseType: 'blob',
  })