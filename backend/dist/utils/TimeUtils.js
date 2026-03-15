"use strict";
/**
 * Utility functions for time formatting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTo12Hour = convertTo12Hour;
/**
 * Converts 24-hour time format to 12-hour AM/PM format
 * @param time24 - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns Time in 12-hour AM/PM format (e.g., "02:30 PM", "09:00 AM")
 */
function convertTo12Hour(time24) {
    if (!time24 || !time24.includes(':')) {
        return time24; // Return as-is if invalid format
    }
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    if (isNaN(hour) || hour < 0 || hour > 23) {
        return time24; // Return as-is if invalid hour
    }
    const period = hour >= 12 ? 'PM' : 'AM';
    // Convert hour to 12-hour format
    if (hour === 0) {
        hour = 12; // Midnight
    }
    else if (hour > 12) {
        hour = hour - 12; // PM hours
    }
    // hour === 12 stays as 12 (noon)
    // Pad hour with leading zero if needed
    const hourStr12 = hour.toString().padStart(2, '0');
    return `${hourStr12}:${minute} ${period}`;
}
