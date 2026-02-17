/**
 * Convex schema design (reference implementation).
 */
export const tables = {
  users: {
    fields: ['userId', 'name', 'passwordHash', 'role', 'createdAt'],
    indexes: ['by_userId', 'by_role'],
  },
  roles: {
    fields: ['name', 'permissions', 'createdAt'],
    indexes: ['by_name'],
  },
  sessions: {
    fields: ['userId', 'token', 'expiresAt', 'createdAt'],
    indexes: ['by_userId', 'by_token', 'by_expiresAt'],
  },
  projects: {
    fields: ['ownerUserId', 'title', 'description', 'sourceCode', 'videoLink', 'createdAt', 'updatedAt'],
    indexes: ['by_ownerUserId', 'by_createdAt'],
  },
  files: {
    fields: ['projectId', 'ownerUserId', 'storageId', 'mimeType', 'size', 'createdAt'],
    indexes: ['by_projectId', 'by_ownerUserId'],
  },
};
