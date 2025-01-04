import * as yup from 'yup';

const schema = yup.object().shape({
  start: yup
    .string()
    .required('Start time is required'),
  end: yup
    .string()
    .required('End time is required')
    .test(
      'is-after-start',
      'End time must be after start time',
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

export default schema;
