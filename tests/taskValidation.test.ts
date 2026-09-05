import { describe, expect, it } from 'vitest';
import {
    isPriority,
    normalizeTaskDescription,
    normalizeTaskTitle,
} from '../src/lib/taskValidation';

describe('task validation', () => {
    it('trims valid titles and descriptions', () => {
        expect(normalizeTaskTitle('  Plan the week  ')).toBe('Plan the week');
        expect(normalizeTaskDescription('  Notes  ')).toBe('Notes');
    });

    it('rejects empty and oversized values', () => {
        expect(() => normalizeTaskTitle('   ')).toThrow('cannot be empty');
        expect(() => normalizeTaskTitle('x'.repeat(201))).toThrow('200');
        expect(() => normalizeTaskDescription('x'.repeat(1001))).toThrow('1000');
    });

    it('accepts only supported priorities', () => {
        expect(isPriority('low')).toBe(true);
        expect(isPriority('medium')).toBe(true);
        expect(isPriority('high')).toBe(true);
        expect(isPriority('urgent')).toBe(false);
    });
});
