export const getAvatarUrl = (user) => {
  if (user?.avatar && 
      user.avatar !== 'https://via.placeholder.com/150' && 
      !user.avatar.includes('ui-avatars.com')) {
    return user.avatar;
  }
  // Use a generic profile silhouette image
  return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=200';
};

export const getProjectImageUrl = (project) => {
  if (project?.image && 
      project.image !== 'https://via.placeholder.com/600x400' && 
      !project.image.includes('unsplash')) {
    return project.image;
  }
  // Use a tech/coding themed image
  return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&q=80';
};