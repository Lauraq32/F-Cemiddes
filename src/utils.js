export const formatDate = (value) => {
  return new Date (value).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });
}