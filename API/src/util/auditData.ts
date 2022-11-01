export const getNewEntityAuditData = (currentUserId?: number | null | undefined) => ({
  created_at: new Date(),
  created_by: currentUserId,
  updated_at: new Date(),
  updated_by: currentUserId,
});

export const getUpdatedEntityAuditData = (currentUserId: number | null | undefined) => ({
  updated_at: new Date(),
  updated_by: currentUserId,
});
