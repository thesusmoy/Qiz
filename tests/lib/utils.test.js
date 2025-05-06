import { cn, formatDate, getImageUrl } from '../../lib/utils';

describe('utils', () => {
  it('cn merges class names', () => {
    expect(cn('a', 'b')).toContain('a');
    expect(cn('a', false, 'b')).toContain('b');
  });

  it('formatDate formats date string', () => {
    expect(formatDate('2024-01-01')).toMatch(/Jan.*2024/);
  });

  it('getImageUrl returns correct url', () => {
    const original = process.env.NEXT_PUBLIC_ASSET_PREFIX;
    process.env.NEXT_PUBLIC_ASSET_PREFIX = 'https://cdn/';
    expect(getImageUrl('/img.png')).toBe('https://cdn//img.png');
    process.env.NEXT_PUBLIC_ASSET_PREFIX = '';
    expect(getImageUrl('/img.png')).toBe('/img.png');
    process.env.NEXT_PUBLIC_ASSET_PREFIX = original;
  });
});
