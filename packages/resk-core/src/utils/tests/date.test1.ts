import "../../utils";
import { isDateObj, DateParser, addToDate, addMilliseconds, addSeconds, addMinutes, addHours, addDays, addMonths, addWeeks, addYears, currentMonthDaysLimits, previousWeekDaysLimits, currentWeekDaysLimits, formatDate} from '../date';

describe('Date Utils', () => {
    describe('isDateObj', () => {
        it('should return true for valid Date objects', () => {
            expect(isDateObj(new Date())).toBe(true);
            expect(isDateObj(new Date('2023-01-01'))).toBe(true);
        });

        it('should return false for invalid inputs', () => {
            expect(isDateObj(null)).toBe(false);
            expect(isDateObj(undefined)).toBe(false);
            expect(isDateObj('2023-01-01')).toBe(false);
            expect(isDateObj(123)).toBe(false);
            expect(isDateObj({})).toBe(false);
        });
    });

    describe('parseDate', () => {
        it('should parse valid date strings', () => {
            const date = DateParser.parseDate('2023-01-01', "YYYY-MM-DD");
            expect(date instanceof Date).toBe(true);
            expect(date?.getFullYear()).toBe(2023);
            expect(date?.getMonth()).toBe(0);
            expect(date?.getDate()).toBe(1);
        });

        it('should return null for invalid dates', () => {
            expect(DateParser.parseDate('invalid-date')).toBeNull();
            expect(DateParser.parseDate(null)).toBeNull();
            expect(DateParser.parseDate(undefined)).toBeNull();
        });
    });

    describe('addToDate', () => {
        it('should add days to date correctly', () => {
            const baseDate = new Date('2023-01-01');
            const result = addToDate(5, baseDate, 'Date');
            expect(result.getDate()).toBe(6);
        });

        it('should handle negative values', () => {
            const baseDate = new Date('2023-01-10');
            const result = addToDate(-5, baseDate, 'Date');
            expect(result.getDate()).toBe(5);
        });
    });

    describe('Time Addition Functions', () => {
        const baseDate = new Date('2023-01-01T00:00:00Z');

        it('should add milliseconds correctly', () => {
            const result = addMilliseconds(1000, baseDate);
            expect(result.getTime()).toBe(baseDate.getTime() + 1000);
        });

        it('should add seconds correctly', () => {
            const result = addSeconds(60, baseDate);
            expect(result.getTime()).toBe(baseDate.getTime() + 60000);
        });

        it('should add minutes correctly', () => {
            const result = addMinutes(60, baseDate);
            expect(result.getTime()).toBe(baseDate.getTime() + 3600000);
        });

        it('should add hours correctly', () => {
            const result = addHours(24, baseDate);
            expect(result.getTime()).toBe(baseDate.getTime() + 86400000);
        });
    });

    describe('Date Range Functions', () => {
        it('should calculate current month limits correctly', () => {
            const testDate = new Date('2023-01-15');
            const { first, last } = currentMonthDaysLimits(testDate);
            expect(first.getDate()).toBe(1);
            expect(last.getDate()).toBe(31);
        });

        it('should calculate previous week limits correctly', () => {
            const testDate = new Date('2023-01-15');
            const { first, last } = previousWeekDaysLimits(testDate);
            expect(first.getDay()).toBe(1);
            expect(last.getDay()).toBe(0);
        });

        it('should calculate current week limits correctly', () => {
            const testDate = new Date('2023-01-15');
            const { first, last } = currentWeekDaysLimits(testDate);
            expect(first.getDate()).toBe(9);
            expect(last.getDate()).toBe(21);
        });
    });

    describe('formatDate', () => {
        it('should format dates correctly', () => {
            const testDate = new Date('2023-01-15T12:30:45');
            expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2023-01-15');
            expect(formatDate(testDate, 'HH:mm:ss')).toBe('12:30:45');
        });
    });

    describe('isValidDate', () => {
        it('should validate dates correctly', () => {
            expect(DateParser.isValidDate(new Date())).toBe(true);
            expect(DateParser.isValidDate('2023-01-01')).toBe(true);
            expect(DateParser.isValidDate('invalid-date')).toBe(false);
            expect(DateParser.isValidDate(null)).toBe(false);
            expect(DateParser.isValidDate(123)).toBe(false);
        });
    });
});
