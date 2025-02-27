import { AppointmentSummary } from "@/hooks/business/useAppointmentSummaries";
import { Appointment, Service } from "../types";
import { Filter } from "./AreaChart";

/**
 * Generates fake appointment data and corresponding summaries.
 * Data is generated from January 1, 2022 until today.
 *
 * @returns A tuple with an array of Appointments and a Map of AppointmentSummaries keyed by appointment id.
 */
export const generateFakeData = (services: Service[]): [Appointment[], Map<number, AppointmentSummary>] => {
  if (!services || services.length === 0) {
    return [[], new Map<number, AppointmentSummary>()];
  }
  const data: Appointment[] = [];
  const summaries = new Map<number, AppointmentSummary>();
  // Starting date for fake data generation
  const startDate = new Date("2022-01-01");
  // End date is current date
  const endDate = new Date();
  // Use a copy of startDate to avoid modifying the original
  const currentDate = new Date(startDate);

  let id = 0;
  // Loop through each day from startDate to endDate
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    // Months are zero-based in JavaScript, so add 1 and pad with zeros for proper formatting
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const service = services[Math.floor(Math.random() * services.length)];
    // Generate an appointment with a random total_price between 50 and 100
    data.push({
      id: id,
      start_time: new Date(dateString),
      total_price: Math.floor(Math.random() * 50) + 50,
    } as Appointment);

    const serviceOptions = Array.from(service.service_options?.values() || []).map((option) => option);
    const serviceOption = serviceOptions[Math.floor(Math.random() * serviceOptions.length)];
    // Generate a summary with random service and service option
    const summary = {
      id: id,
      service:service?.name,
      service_option: serviceOption?.name
    } as AppointmentSummary;
    summaries.set(id, summary);
    id++;
    // Increment the day by 1 (could be randomized if needed)
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return [data, summaries];
};

/**
 * Type definition for Month string.
 */
export type Month = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";
// Array of month abbreviations in order.
const MONTHS: Month[] = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * Converts a month abbreviation to its corresponding 1-indexed month number.
 *
 * @param month - Month abbreviation (or "all" which returns -1)
 * @returns A 1-indexed month number (or -1 for "all" or undefined).
 */
export const getMonthIndex = (month: Month | "all"): number => {
  if (month === "all" || month === undefined) return -1;
  const index = MONTHS.indexOf(month);
  if (index === -1) {
    throw new Error(`Invalid month: ${month}`);
  }
  // Return 1-indexed month (e.g., Jan = 1)
  return index + 1;
};

/**
 * Groups data by day for a specific month and year.
 *
 * @param data - Array of objects with date string (x) and value (y).
 * @param month - Month abbreviation to group by.
 * @param year - Year to group the data.
 * @returns An array with an entry for each day of the month with the summed values.
 */
export const groupByDateInMonth = (data: { x: string, y: number }[], month: Month, year: number): { x: string, y: number }[] => {
  const monthIndex = getMonthIndex(month);
  if (monthIndex === -1) {
    throw new Error(`Invalid month: ${month}`);
  }
  // Get the number of days in the month (note: monthIndex is 1-indexed)
  const daysInMonth = new Date(year, monthIndex, 0).getDate();
  const groupedData: { x: string, y: number }[] = [];

  // Initialize groupedData with each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, monthIndex - 1, i, 1);
    groupedData.push({ x: date.toISOString().split('T')[0], y: 0 });
  }

  // Sum values for each day found in the input data
  for (const { x, y } of data) {
    const date = new Date(x);
    if (isNaN(date.getTime())) continue;
    const day = date.getDate(); // 1-indexed day of the month.
    groupedData[day - 1].y += y;
  }
  return groupedData;
};

/**
 * Groups data by date over a continuous range.
 *
 * @param data - Array of objects with a date string (x) and value (y).
 * @returns An array with an entry for every date in the range with summed values.
 */
export const groupByDate = (data: { x: string, y: number }[]): { x: string, y: number }[] => {
  // Create a set of unique dates (as timestamps)
  const dates = Array.from(new Set(data.map(({ x }) => new Date(x).getTime())));
  const min = Math.min(...dates);
  const max = Math.max(...dates);
  const groupedData: { x: string, y: number }[] = [];
  // Build the grouped data with an entry for every day in the range
  for (let date = min; date <= max; date += 86400000) {
    groupedData.push({ x: new Date(date).toISOString().split('T')[0], y: 0 });
  }
  // Accumulate values for each matching date
  for (const { x, y } of data) {
    const index = groupedData.findIndex(({ x: date }) => date === x);
    groupedData[index].y += y;
  }
  return groupedData;
};

/**
 * Groups data by month for a given year.
 *
 * @param data - Array of objects with a date string (x) and value (y).
 * @param year - Year to group the data, or "all" to use all data.
 * @returns An array with an entry for each month of the year with summed values.
 */
export const groupByMonthInYear = (data: { x: string, y: number }[], year: number | "all"): { x: string, y: number }[] => {
  if (year === "all") return groupByMonth(data);
  // Create an array of month start dates for the given year
  const months = Array.from({ length: 12 }, (_, i) => {
    return new Date(year, i, 1, 1).toISOString().split('T')[0];
  });
  // Initialize grouped data with 0 for each month
  const groupedData: { x: string, y: number }[] = months.map(month => ({ x: month, y: 0 }));
  // Sum values for each month
  for (const { x, y } of data) {
    const date = new Date(x);
    if (isNaN(date.getTime())) continue;
    const monthIndex = date.getMonth(); // 0-indexed: 0 for Jan, 1 for Feb, etc.
    groupedData[monthIndex].y += y;
  }
  return groupedData;
};

/**
 * Groups data by month over a continuous range.
 *
 * @param data - Array of objects with a date string (x) and value (y).
 * @returns An array with an entry for each month with summed values.
 */
export const groupByMonth = (data: { x: string, y: number }[]): { x: string, y: number }[] => {
  // Create a set of unique month start dates (as timestamps)
  const months = Array.from(new Set(data.map(({ x }) => {
    const date = new Date(x);
    return new Date(date.getFullYear(), date.getMonth(), 1, 1).getTime();
  })));
  const min = new Date(Math.min(...months));
  const max = new Date(Math.max(...months));

  const groupedData: { x: string, y: number }[] = [];
  // Build the grouped data with an entry for every month in the range
  for (let date = new Date(min); date <= max; date.setMonth(date.getMonth() + 1)) {
    groupedData.push({ x: new Date(date).toISOString().split('T')[0], y: 0 });
  }

  // Accumulate values for each corresponding month
  for (const { x, y } of data) {
    const index = groupedData.findIndex(({ x: group }) => {
      const date = new Date(x);
      const key = new Date(date.getFullYear(), date.getMonth(), 1, 1).toISOString().split('T')[0];
      return key === group;
    });
    groupedData[index].y += y;
  }
  return groupedData;
};

/**
 * Groups data by year.
 *
 * @param data - Array of objects with a date string (x) and value (y).
 * @returns An array with an entry for each year with summed values.
 */
export const groupByYear = (data: { x: string, y: number }[]): { x: string, y: number }[] => {
  // Get a set of unique years
  const years = Array.from(new Set(data.map(({ x }) => new Date(x).getFullYear())));
  const min = Math.min(...years);
  const max = Math.max(...years);
  const groupedData: { x: string, y: number }[] = [];
  // Initialize grouped data for each year in the range
  for (let year = min; year <= max; year++) {
    groupedData.push({ x: year.toString(), y: 0 });
  }
  // Sum values for each year
  for (const { x, y } of data) {
    const year = new Date(x).getFullYear();
    groupedData[years.indexOf(year)].y += y;
  }
  return groupedData;
};

/**
 * Converts a number to its ordinal string representation.
 *
 * @param num - The number to convert.
 * @returns The ordinal string (e.g., 1 becomes "1st", 2 becomes "2nd").
 */
export function toOrdinal(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  let suffix = "th";
  if (lastDigit === 1 && lastTwoDigits !== 11) suffix = "st";
  if (lastDigit === 2 && lastTwoDigits !== 12) suffix = "nd";
  if (lastDigit === 3 && lastTwoDigits !== 13) suffix = "rd";

  return `${num}${suffix}`;
}

/**
 * Parses a numeric value into a formatted currency string.
 * Uses formatMoney (which is worklet-enabled) to format the number.
 *
 * @param value - The numeric value.
 * @returns A string formatted as currency (e.g., "£1,000" or "£1.2mil").
 */
export const parseYLabel = (value: number): string =>
  value >= 0 && value === Number(value.toFixed(0)) ? `£${formatMoney(value)}` : "";

/**
 * Parses a date string into a label based on the given increment.
 *
 * @param value - The date string.
 * @param filter - The filter object (can affect label formatting).
 * @param increment - The grouping increment ("year", "month", "date", or undefined).
 * @returns A formatted label (e.g., year number, short month name, or ordinal date).
 */
export const parseXLabel = (value: string, filter: Filter, increment: "year" | "month" | "date" | undefined): string => {
  if (!value) return "";
  switch (increment) {
    case "year":
      return `${new Date(value).getFullYear()}`;
    case "month":
      return new Date(value).toLocaleString('default', { month: 'short' });
    case "date":
      return toOrdinal(new Date(value).getDate());
    default:
      return new Date(value).toLocaleString('default', { month: 'short' });
  }
};

/**
 * Filters appointments to only those that occur in the given month.
 *
 * @param appointment - Array of appointments.
 * @param month - Month abbreviation or "all".
 * @returns A filtered array of appointments.
 */
export const filterByMonth = (appointment: Appointment[], month: Month | "all" | undefined): Appointment[] => {
  if (!month || month === "all") return appointment;
  return appointment.filter((a) =>
    new Date(a.start_time).toLocaleString('default', { month: 'short' }).toLowerCase() === month
  );
};

/**
 * Filters appointments to only those that occur in the given year.
 *
 * @param appointment - Array of appointments.
 * @param year - The year to filter by.
 * @returns A filtered array of appointments.
 */
export const filterByYear = (appointment: Appointment[], year: number | undefined): Appointment[] => {
  if (!year) return appointment;
  return appointment.filter((a) => new Date(a.start_time).getFullYear() === year);
};

/**
 * Filters appointments based on a specific service.
 *
 * @param appointment - Array of appointments.
 * @param summaries - Map of appointment summaries.
 * @param service - The service to filter by.
 * @returns A filtered array of appointments.
 */
export const filterByService = (appointment: Appointment[], summaries: Map<number, AppointmentSummary>, service: string | undefined): Appointment[] => {
  if (!service) return appointment;
  return appointment.filter((a) => summaries.get(a.id)?.service === service);
};

/**
 * Filters appointments based on both service and service option.
 *
 * @param appointment - Array of appointments.
 * @param summaries - Map of appointment summaries.
 * @param service - The service to filter by.
 * @param serviceOption - The specific service option.
 * @returns A filtered array of appointments.
 */
export const filterByServiceOption = (
  appointment: Appointment[],
  summaries: Map<number, AppointmentSummary>,
  service: string | undefined,
  serviceOption: string | undefined
): Appointment[] => {
  if (!service) return appointment;
  if (!serviceOption) return filterByService(appointment, summaries, service);
  return appointment.filter(
    (a) =>
      summaries.get(a.id)?.service === service &&
      summaries.get(a.id)?.service_option === serviceOption
  );
};

/**
 * Checks if a given date is within a specified range (in months) from a current date.
 *
 * @param date - The date to check.
 * @param currentDate - The reference date.
 * @param range - The range in months (or "all" to include all dates).
 * @returns True if the date is within the range, false otherwise.
 */
export const isInRange = (date: Date, currentDate: Date, range: 1 | 3 | 6 | 12 | "all" | undefined): boolean => {
  if (!range) return false;
  if (range === "all") return true;
  const xMonthsAgo = new Date(currentDate);
  xMonthsAgo.setMonth(xMonthsAgo.getMonth() - range);
  return date >= xMonthsAgo;
};

/**
 * Filters appointments based on a range of months relative to the current date.
 *
 * @param appointment - Array of appointments.
 * @param range - The range in months (or "all" to include all appointments).
 * @returns A filtered array of appointments.
 */
export const filterByRange = (appointment: Appointment[], range: 1 | 3 | 6 | 12 | "all"): Appointment[] => {
  return appointment.filter((a) => isInRange(a.start_time, new Date(), range));
};

/**
 * Filters appointments based on various criteria provided in the filter.
 *
 * @param appointments - Array of appointments.
 * @param summaries - Map of appointment summaries.
 * @param filter - Filter object containing range, year, month, service, etc.
 * @returns A filtered array of appointments.
 */
export const filterAppointments = (appointments: Appointment[], summaries: Map<number, AppointmentSummary>, filter: Filter): Appointment[] => {
  let filteredData = appointments;
  // If no specific range is provided, filter by year and month
  if (!filter.range) {
    filteredData = filterByYear(filteredData, filter.year);
    if (filter.month !== "all") {
      filteredData = filterByMonth(filteredData, filter.month);
    }
  } else {
    // Otherwise, filter by the range (in months)
    filteredData = filterByRange(filteredData, filter.range);
  }
  // Filter further by service (and service option if specified)
  if (filter.service !== "all") {
    filteredData = filterByService(filteredData, summaries, filter.service);
    if (filter.serviceOption !== "all") {
      filteredData = filterByServiceOption(filteredData, summaries, filter.service, filter.serviceOption);
    }
  }
  return filteredData;
};

/**
 * Formats a number into a currency string.
 * If below 1 million, uses comma separators; if 1 million or above, converts to "mil" format.
 * Marked as a worklet for use in Reanimated.
 *
 * @param num - The numeric value to format.
 * @returns A formatted string representing the money value.
 */
export const formatMoney = (num: number): string => {
  'worklet';
  if (num < 1000000) {
    // For values below one million, return a comma-separated string.
    return num.toLocaleString();
  } else {
    // For values in the millions, convert to "mil" format with one decimal.
    const millions = num / 1000000;
    // Remove trailing .0 (e.g., 1.0 becomes 1)
    const formatted = millions.toFixed(1).replace(/\.0$/, '');
    return formatted + 'mil';
  }
};

/**
 * Calculates the percentage change between the current revenue and the revenue
 * from the previous period (defined as the period preceding the current lookback period).
 *
 * For example, if lookBack is 3 (months), the previous period is from 6 months ago to 3 months ago.
 *
 * @param appointments - Array of appointments.
 * @param filter - Filter object containing range, year, month, etc.
 * @param currentRevenue - The revenue for the current period.
 * @returns A tuple with the percentage change and context string, or [null, null] if not applicable.
 */
export const getChangePercentage = (
  appointments: Appointment[],
  filter: Filter,
  currentRevenue: number
): [number, string] | [null, null] => {
  // Return null if filter range is "all"
  if (filter.range === "all") {
    return [null, null];
  }
  let lookBack: 1 | 3 | 6 | 12 = 1;
  let context = "since previous month";

  // Determine lookBack value and context based on filter criteria
  if (filter.year && filter.month !== "all" && filter.month !== undefined) {
    lookBack = 1;
    context = "since previous month";
  } else if (filter.year && (filter.month === "all" || filter.month === undefined)) {
    lookBack = 12;
    context = "since previous year";
  } else if (filter.range) {
    lookBack = filter.range;
    if (lookBack === 3) {
      context = "since last quarter";
    }
    if (lookBack === 6) {
      context = "since last 6 months";
    }
    if (lookBack === 12) {
      context = "since last 12 months";
    }
  }

  const now = new Date();

  // Calculate the end of the previous period:
  // This is current date minus lookBack months (minus one day to avoid double-counting the current day)
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() - lookBack);
  endDate.setDate(endDate.getDate() - 1);

  // Calculate the start of the previous period:
  // This is current date minus 2 * lookBack months (minus one day)
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - lookBack * 2);
  startDate.setDate(startDate.getDate() - 1);

  // Filter appointments that fall within the previous period
  const previousAppointments = appointments.filter((a) => {
    const appDate = new Date(a.start_time);
    return appDate >= startDate && appDate <= endDate;
  });

  // Sum the revenue from the previous period
  const previousRevenue = previousAppointments.reduce(
    (acc, a) => acc + a.total_price,
    0
  );
  // Avoid division by zero—if no revenue was recorded in the previous period, return null.
  if (previousRevenue === 0) {
    return [null, null];
  }

  // Calculate and return the percentage change along with the context
  return [((currentRevenue - previousRevenue) / previousRevenue) * 100, context];
};
