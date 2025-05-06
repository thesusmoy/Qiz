import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormQuestion } from '../../../components/forms/form-question';

const renderWithForm = (question) => {
  const Wrapper = ({ children }) => {
    const methods = useForm({ defaultValues: { [question.id]: '' } });
    return (
      <FormProvider {...methods}>{children(methods.control)}</FormProvider>
    );
  };
  render(
    <Wrapper>
      {(control) => <FormQuestion question={question} control={control} />}
    </Wrapper>
  );
};

describe('FormQuestion', () => {
  it('renders single-line input', () => {
    renderWithForm({
      id: 'q1',
      text: 'Name',
      type: 'single_line',
      required: true,
    });
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders multi-line textarea', () => {
    renderWithForm({ id: 'q2', text: 'Description', type: 'multi_line' });
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders integer input', () => {
    renderWithForm({ id: 'q3', text: 'Age', type: 'integer' });
    expect(screen.getByLabelText(/age/i)).toHaveAttribute('type', 'number');
  });

  it('renders checkbox', () => {
    renderWithForm({
      id: 'q4',
      text: 'Accept Terms',
      type: 'checkbox',
      checkboxLabel: 'Accept',
    });
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
