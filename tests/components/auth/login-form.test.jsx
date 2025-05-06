import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../../../components/auth/login-form';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ update: jest.fn() }),
  signIn: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders Google sign in button', () => {
    render(<LoginForm />);
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });
});
