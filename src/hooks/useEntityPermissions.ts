import { useState, useEffect } from 'react';
import { useAuth } from '../components/providers/AuthProvider';
import { supabase } from '../lib/supabase';

export type EntityType = 'community' | 'cafe' | 'event';
export type UserRole = 'admin' | 'moderator' | 'member' | null;

interface UseEntityPermissionsReturn {
  role: UserRole;
  isLoading: boolean;
  error: Error | null;
  canModerate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useEntityPermissions(
  entityType: EntityType,
  entityId: string
): UseEntityPermissionsReturn {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch user role from the database
        const { data, error: fetchError } = await supabase
          .from(`${entityType}_members`)
          .select('role')
          .eq('user_id', user.id)
          .eq(`${entityType}_id`, entityId)
          .single();

        if (fetchError) throw fetchError;

        setRole(data?.role || 'member');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user role'));
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user, entityType, entityId]);

  return {
    role,
    isLoading,
    error,
    canModerate: role === 'admin' || role === 'moderator',
    canEdit: role === 'admin' || role === 'moderator',
    canDelete: role === 'admin'
  };
}