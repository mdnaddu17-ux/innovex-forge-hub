export const mutations = {
  signUp: 'Create user + hashed credentials + default role',
  login: 'Create session token and expiry',
  logout: 'Revoke active session',
  createProject: 'Insert project owned by current user',
  assignRole: 'Admin-only role mutation',
  attachFileToProject: 'Upload metadata and relation',
};
