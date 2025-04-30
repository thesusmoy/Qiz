export function isAdmin(user) {
  return user?.role === 'ADMIN';
}

export function canAccessTemplate(user, template) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (template.public) return true;
  return template.authorId === user.id;
}
