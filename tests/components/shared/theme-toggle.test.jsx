import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../../../components/shared/theme-toggle';

jest.mock('@/lib/stores/theme-store', () => ({
  useThemeStore: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('shows tooltip content', async () => {
    render(<ThemeToggle />);
    // Tooltip may require hover, but we can check for the text in the DOM
    expect(screen.getByText(/switch to dark mode/i)).toBeInTheDocument();
  });
});
