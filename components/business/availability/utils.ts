import * as yup from 'yup';

const timeSchema = yup.object().shape({
  start: yup
    .date()
    .required('Start time is required'),
  end: yup
    .date()
    .required('End time is required')
    .test(
      'is-after-start',
      'Invalid range',
      function (value) {
        const { start } = this.parent; // Access the `start` value
        if (!start || !value) return false; // Both fields must be provided
        return new Date(value) > new Date(start);
      }
    ),
  excludeWeekends: yup
    .boolean()
    .required('Exclude weekends is required')
    .default(false),
});

function formatDate(date: Date | string | undefined): string | undefined {
  if (!date) {
    return undefined; // Fallback for missing or invalid date
  }

  const dateObj = new Date(date);

  // Check if the date is invalid
  if (isNaN(dateObj.getTime())) {
    return undefined; // Handle invalid dates
  }

  // Extract weekday, day, and month
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' }); // Full weekday name (e.g., "Monday")
  const day = dateObj.getDate(); // Day of the month (e.g., "5")
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' }); // Full month name (e.g., "October")

  // Return the formatted string
  return `${weekday} ${day} ${month}`;
}

export { timeSchema, formatDate};
