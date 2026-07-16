import { useQuery } from '@tanstack/react-query'
import reportsService from '../services/reportsService'
import { unwrapList, getCount } from '../services/response'

export const useReports = (filters = {}) => {
  const { data, isLoading, error, refetch } = useQuery(['reports', filters], () => reportsService.getReports(filters), {
    staleTime: 30000,
    cacheTime: 5 * 60 * 1000,
  })

  return {
    reports: unwrapList(data),
    count: getCount(data, unwrapList(data)),
    loading: isLoading,
    error,
    refetch,
  }
}

export default useReports
