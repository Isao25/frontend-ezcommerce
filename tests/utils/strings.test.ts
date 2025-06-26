import { truncateString, hash } from '@/utils/strings';

describe('strings utilities', () => {
  describe('truncateString', () => {
    test('truncates string when longer than maxLength', () => {
      const result = truncateString('This is a long string', 10);
      expect(result).toBe('This is a ...');
    });

    test('returns original string when shorter than maxLength', () => {
      const result = truncateString('Short', 10);
      expect(result).toBe('Short');
    });

    test('returns original string when equal to maxLength', () => {
      const result = truncateString('Exactly10!', 10);
      expect(result).toBe('Exactly10!');
    });
  });

  describe('hash', () => {
    test('generates consistent hash for same input', () => {
      const result1 = hash('test');
      const result2 = hash('test');
      expect(result1).toBe(result2);
    });

    test('generates different hashes for different inputs', () => {
      const result1 = hash('test1');
      const result2 = hash('test2');
      expect(result1).not.toBe(result2);
    });

    test('handles empty string', () => {
      const result = hash('');
      expect(result).toBe(0);
    });
  });
});


describe('String utilities', () => {
  describe('truncateString', () => {
    it('truncates string when longer than maxLength', () => {
      const text = 'This is a very long string that should be truncated';
      const result = truncateString(text, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result).toHaveLength(23); // 20 + 3 for '...'
    });

    it('returns original string when shorter than maxLength', () => {
      const text = 'Short string';
      const result = truncateString(text, 20);
      
      expect(result).toBe('Short string');
    });

    it('returns original string when equal to maxLength', () => {
      const text = 'Exactly twenty chars';
      const result = truncateString(text, 20);
      
      expect(result).toBe('Exactly twenty chars');
    });

    it('handles empty string', () => {
      const result = truncateString('', 10);
      expect(result).toBe('');
    });

    it('handles maxLength of 0', () => {
      const result = truncateString('test', 0);
      expect(result).toBe('...');
    });

    it('handles single character strings', () => {
      const result = truncateString('a', 5);
      expect(result).toBe('a');
    });

    it('truncates single character when maxLength is 0', () => {
      const result = truncateString('a', 0);
      expect(result).toBe('...');
    });

    it('handles unicode characters correctly', () => {
      const text = 'Hello 🌟 World 🚀';
      const result = truncateString(text, 10);
      expect(result).toBe('Hello 🌟 Wo...');
    });
  });

  describe('hash', () => {
    it('generates consistent hash for same string', () => {
      const text = 'test string';
      const hash1 = hash(text);
      const hash2 = hash(text);
      
      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('number');
    });

    it('generates different hashes for different strings', () => {
      const text1 = 'test string 1';
      const text2 = 'test string 2';
      const hash1 = hash(text1);
      const hash2 = hash(text2);
      
      expect(hash1).not.toBe(hash2);
    });

    it('handles empty string', () => {
      const result = hash('');
      expect(result).toBe(0);
    });

    it('handles single character', () => {
      const result = hash('a');
      expect(result).toBe(97); // ASCII code for 'a'
    });

    it('handles unicode characters', () => {
      const result = hash('🌟');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('generates positive numbers', () => {
      const testStrings = ['hello', 'world', 'test', '123', 'abc'];
      
      testStrings.forEach(str => {
        const result = hash(str);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });

    it('is deterministic', () => {
      const text = 'deterministic test';
      const results = Array.from({ length: 100 }, () => hash(text));
      
      // All results should be the same
      expect(new Set(results).size).toBe(1);
    });

    it('handles special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const result = hash(specialChars);
      
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('handles mixed case strings differently', () => {
      const lower = hash('hello world');
      const upper = hash('HELLO WORLD');
      const mixed = hash('Hello World');
      
      expect(lower).not.toBe(upper);
      expect(lower).not.toBe(mixed);
      expect(upper).not.toBe(mixed);
    });
  });
});