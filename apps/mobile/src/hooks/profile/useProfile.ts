import { authApis, User } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";

export const PROFILE_QUERY_KEY = ["profile", "me"] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => authApis.me(),
    staleTime: 60_000,
  });
}

export function mapUserToProfile(user: User | undefined) {
  if (!user) return null;
  return user;
}
