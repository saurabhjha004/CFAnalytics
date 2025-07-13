
import { useQuery } from '@tanstack/react-query';
import { codeforcesApi } from '@/services/codeforcesApi';

export const useCodeforcesData = (handle: string) => {
  const userInfoQuery = useQuery({
    queryKey: ['userInfo', handle],
    queryFn: () => codeforcesApi.getUserInfo(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });

  const submissionsQuery = useQuery({
    queryKey: ['submissions', handle],
    queryFn: () => codeforcesApi.getUserSubmissions(handle, 500),
    enabled: !!handle,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const contestsQuery = useQuery({
    queryKey: ['contests', handle],
    queryFn: () => codeforcesApi.getUserRating(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const isLoading = userInfoQuery.isLoading || submissionsQuery.isLoading || contestsQuery.isLoading;
  const error = userInfoQuery.error || submissionsQuery.error || contestsQuery.error;

  return {
    data: {
      userInfo: userInfoQuery.data,
      submissions: submissionsQuery.data || [],
      contests: contestsQuery.data || [],
      handle,
    },
    isLoading,
    error,
    refetch: () => {
      userInfoQuery.refetch();
      submissionsQuery.refetch();
      contestsQuery.refetch();
    },
  };
};
