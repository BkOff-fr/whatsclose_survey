import {
  validateEmail,
  formatFirstName,
  validateUserData,
  calculateReadingTime,
  debounce,
  throttle,
  lerp,
  clamp,
  randomBetween,
  formatDate,
  isMobile,
  generateUniqueId,
} from '@/utils/helpers';

describe('Utils - Helpers', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatFirstName', () => {
    it('should capitalize first letter and lowercase the rest', () => {
      expect(formatFirstName('john')).toBe('John');
      expect(formatFirstName('JOHN')).toBe('John');
      expect(formatFirstName('jOhN')).toBe('John');
      expect(formatFirstName('marie-claire')).toBe('Marie-claire');
    });

    it('should handle empty strings', () => {
      expect(formatFirstName('')).toBe('');
    });
  });

  describe('validateUserData', () => {
    it('should validate complete user data', () => {
      const validData = {
        firstName: 'John',
        city: 'Paris',
        email: 'john@example.com',
      };
      expect(validateUserData(validData)).toBe(true);
    });

    it('should reject incomplete user data', () => {
      expect(validateUserData({ firstName: 'J', city: 'Paris', email: 'john@example.com' })).toBe(false);
      expect(validateUserData({ firstName: 'John', city: 'P', email: 'john@example.com' })).toBe(false);
      expect(validateUserData({ firstName: 'John', city: 'Paris', email: 'invalid' })).toBe(false);
      expect(validateUserData({})).toBe(false);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time based on word count', () => {
      const shortText = 'Hello world'; // 2 words
      const mediumText = Array(100).fill('word').join(' '); // 100 words
      const longText = Array(500).fill('word').join(' '); // 500 words

      expect(calculateReadingTime(shortText)).toBeGreaterThanOrEqual(1000);
      expect(calculateReadingTime(mediumText)).toBeLessThan(60000);
      expect(calculateReadingTime(longText)).toBeGreaterThan(60000);
    });

    it('should return minimum 1 second for very short texts', () => {
      expect(calculateReadingTime('')).toBe(1000);
      expect(calculateReadingTime('Hi')).toBe(1000);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      jest.advanceTimersByTime(100);
      throttledFn('fourth');

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('fourth');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('randomBetween', () => {
    it('should generate random numbers within range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(5, 10);
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomBetween(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-5);
      }
    });
  });

  describe('formatDate', () => {
    it('should format dates in French locale', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toContain('janvier');
      expect(formatted).toContain('2024');
    });
  });

  describe('generateUniqueId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateUniqueId());
      }
      expect(ids.size).toBe(1000);
    });

    it('should include timestamp and random string', () => {
      const id = generateUniqueId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });
});