import { render, screen } from '@testing-library/react';
import { UserProfilePage } from '../../../components/profile/user-profile-page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));
jest.mock('../../../components/profile/user-templates-table', () => ({
  UserTemplatesTable: () => <div>Templates Table</div>,
}));
jest.mock('../../../components/profile/user-responses-table', () => ({
  UserResponsesTable: () => <div>Responses Table</div>,
}));

describe('UserProfilePage', () => {
  const user = {
    name: 'Alice',
    email: 'alice@example.com',
    image: '/avatar.png',
    createdAt: '2024-01-01T00:00:00Z',
  };

  it('renders user info and tabs', () => {
    render(<UserProfilePage user={user} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('My Templates')).toBeInTheDocument();
    expect(screen.getByText('My Responses')).toBeInTheDocument();
  });

  it('shows profile information by default', () => {
    render(<UserProfilePage user={user} />);
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(
      screen.getByText('Your personal information and account details')
    ).toBeInTheDocument();
  });
});
