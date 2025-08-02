export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Si la diferencia es menor a 60 segundos
  if (diffInSeconds < 60) {
    return 'Hace un momento';
  }

  // Si la diferencia es menor a 3600 segundos (1 hora)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  // Si la diferencia es menor a 86400 segundos (1 día)
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  // Si la diferencia es mayor a 1 día
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 