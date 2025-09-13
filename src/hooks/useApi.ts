import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { DataState } from '../types';

export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<DataState<T>>({
    isLoading: true,
    data: undefined,
    error: undefined,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const response = await apiCall();
      setState({
        isLoading: false,
        data: response.data,
        error: undefined,
      });
    } catch (error: any) {
      setState({
        isLoading: false,
        data: undefined,
        error: {
          code: error.response?.status?.toString() || 'UNKNOWN',
          message: error.response?.data?.message || error.message || 'An error occurred',
          details: error.response?.data,
        },
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

export function useProjects() {
  return useApi(() => apiClient.getProjects());
}

export function useProject(id: string) {
  return useApi(() => apiClient.getProject(id), [id]);
}

export function useServices() {
  return useApi(() => apiClient.getServices());
}

export function useService(id: string) {
  return useApi(() => apiClient.getService(id), [id]);
}

export function useTeamMembers() {
  return useApi(() => apiClient.getTeamMembers());
}

export function useTeamMember(id: string) {
  return useApi(() => apiClient.getTeamMember(id), [id]);
}

export function useReviews() {
  return useApi(() => apiClient.getReviews());
}

export function useReview(id: string) {
  return useApi(() => apiClient.getReview(id), [id]);
}

export function useConsultations() {
  return useApi(() => apiClient.getConsultations());
}

export function useConsultation(id: string) {
  return useApi(() => apiClient.getConsultation(id), [id]);
}

export function useChats(consultationId: string) {
  return useApi(() => apiClient.getChats(consultationId), [consultationId]);
}

export function useThemes() {
  return useApi(() => apiClient.getThemes());
}

export function useActiveTheme() {
  return useApi(() => apiClient.getActiveTheme());
}

export function useSettings() {
  return useApi(() => apiClient.getSettings());
}
