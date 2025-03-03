
export const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
export const isTomorrow = (date: Date) => {
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
  return date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();
}

export function formatDateDifference(targetDate: Date): string {
  // Get the current date and time
  const now = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = targetDate.getTime() - now.getTime();

  // Determine if the date is in the past or future
  const isPast = differenceInMs < 0;
  const absoluteDifference = Math.abs(differenceInMs);

  // Convert milliseconds to minutes, hours, days, and weeks
  const differenceInMinutes = Math.floor(absoluteDifference / (1000 * 60));
  const differenceInHours = Math.floor(absoluteDifference / (1000 * 60 * 60));
  const differenceInDays = Math.floor(absoluteDifference / (1000 * 60 * 60 * 24));
  const differenceInWeeks = Math.floor(differenceInDays / 7);

  // Format the output based on the magnitude of the difference
  if (differenceInMinutes < 60) {
    // Less than 1 hour
    return isPast
      ? `${differenceInMinutes} minute${differenceInMinutes !== 1 ? 's' : ''} ago`
      : `in ${differenceInMinutes} minute${differenceInMinutes !== 1 ? 's' : ''}`;
  } else if (differenceInHours < 24) {
    // Less than 1 day
    return isPast
      ? `${differenceInHours} hour${differenceInHours !== 1 ? 's' : ''} ago`
      : `in ${differenceInHours} hour${differenceInHours !== 1 ? 's' : ''}`;
  } else if (differenceInDays < 14) {
    // Less than 2 weeks
    return isPast
      ? `${differenceInDays} day${differenceInDays !== 1 ? 's' : ''} ago`
      : `in ${differenceInDays} day${differenceInDays !== 1 ? 's' : ''}`;
  } else {
    // More than 2 weeks
    return isPast
      ? `${differenceInWeeks} week${differenceInWeeks !== 1 ? 's' : ''} ago`
      : `in ${differenceInWeeks} week${differenceInWeeks !== 1 ? 's' : ''}`;
  }
}

export const hasPast = (date: Date) => date < new Date();
export const isSameDay = (date1: Date, date2: Date) => (
  date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
)