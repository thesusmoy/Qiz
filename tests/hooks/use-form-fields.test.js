import { render } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { useFormFields } from '../../hooks/use-form-fields';
import React from 'react';

describe('useFormFields', () => {
  function Wrapper({ children }) {
    const methods = useForm({ defaultValues: { isPublic: false } });
    return (
      <FormProvider {...methods}>{children(methods.control)}</FormProvider>
    );
  }

  it('renders text field', () => {
    render(
      <Wrapper>
        {(control) =>
          useFormFields().renderTextField({
            control,
            name: 'test',
            label: 'Test Label',
          })
        }
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Test Label');
  });

  it('renders topic field', () => {
    render(
      <Wrapper>
        {(control) => useFormFields().renderTopicField({ control })}
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Topic');
  });

  it('renders tags field', () => {
    render(
      <Wrapper>
        {(control) => useFormFields().renderTagsField({ control })}
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Tags');
  });

  it('renders visibility field', () => {
    render(
      <Wrapper>
        {(control) => useFormFields().renderVisibilityField({ control })}
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Make this template public');
  });

  it('renders allowed users field when not public', () => {
    render(
      <Wrapper>
        {(control) =>
          useFormFields().renderAllowedUsersField({ control, isPublic: false })
        }
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Allowed Users');
  });

  it('does not render allowed users field when public', () => {
    const { container } = render(
      <Wrapper>
        {(control) =>
          useFormFields().renderAllowedUsersField({ control, isPublic: true })
        }
      </Wrapper>
    );
    expect(container.textContent).not.toContain('Allowed Users');
  });

  it('renders image field', () => {
    render(
      <Wrapper>
        {(control) => useFormFields().renderImageField({ control })}
      </Wrapper>
    );
    expect(document.body.textContent).toContain('Image');
  });
});
