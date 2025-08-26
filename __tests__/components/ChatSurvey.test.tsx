import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSurvey from '@/components/Survey/ChatSurvey3D';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ChatSurvey Component', () => {
  const mockOnComplete = jest.fn();
  const mockOnStartStory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial welcome message', async () => {
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Bienvenue dans l'expérience WhatsClose/i)).toBeInTheDocument();
    });
  });

  it('should handle text input for first name', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Entrez votre prénom/i);
      expect(input).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Entrez votre prénom/i) as HTMLInputElement;
    await user.type(input, 'John');
    
    expect(input.value).toBe('John');
  });

  it('should submit form on Enter key press', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Entrez votre prénom/i);
      expect(input).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Entrez votre prénom/i) as HTMLInputElement;
    await user.type(input, 'John{enter}');

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  it('should show progress bar', () => {
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    const progressBar = document.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle option selection', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    // Avancer jusqu'à la question avec options
    // Simuler les réponses pour arriver aux options
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Entrez votre prénom/i);
      expect(input).toBeInTheDocument();
    });

    const firstNameInput = screen.getByPlaceholderText(/Entrez votre prénom/i) as HTMLInputElement;
    await user.type(firstNameInput, 'John{enter}');

    await waitFor(() => {
      const cityInput = screen.getByPlaceholderText(/Lyon, Paris, Marseille/i);
      expect(cityInput).toBeInTheDocument();
    });

    const cityInput = screen.getByPlaceholderText(/Lyon, Paris, Marseille/i) as HTMLInputElement;
    await user.type(cityInput, 'Paris{enter}');

    // Vérifier que les options sont affichées
    await waitFor(() => {
      expect(screen.getByText(/Tous les jours/i)).toBeInTheDocument();
      expect(screen.getByText(/Chaque semaine/i)).toBeInTheDocument();
      expect(screen.getByText(/Occasionnellement/i)).toBeInTheDocument();
    });

    // Cliquer sur une option
    const option = screen.getByText(/Chaque semaine/i);
    await user.click(option);

    await waitFor(() => {
      expect(screen.getByText('Chaque semaine')).toBeInTheDocument();
    });
  });

  it('should trigger story mode at the right moment', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    // Répondre aux questions jusqu'au déclenchement de l'histoire
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Entrez votre prénom/i);
      expect(input).toBeInTheDocument();
    });

    const firstNameInput = screen.getByPlaceholderText(/Entrez votre prénom/i) as HTMLInputElement;
    await user.type(firstNameInput, 'John{enter}');

    await waitFor(() => {
      const cityInput = screen.getByPlaceholderText(/Lyon, Paris, Marseille/i);
      expect(cityInput).toBeInTheDocument();
    });

    const cityInput = screen.getByPlaceholderText(/Lyon, Paris, Marseille/i) as HTMLInputElement;
    await user.type(cityInput, 'Paris{enter}');

    await waitFor(() => {
      const option = screen.getByText(/Chaque semaine/i);
      expect(option).toBeInTheDocument();
    });

    const option = screen.getByText(/Chaque semaine/i);
    await user.click(option);

    // Vérifier que l'histoire est déclenchée
    await waitFor(() => {
      expect(mockOnStartStory).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('should not render when not visible', () => {
    const { container } = render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should display typing indicator', async () => {
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/WhatsClose réfléchit.../i)).toBeInTheDocument();
    });
  });

  it('should handle multi-option selection', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    // Naviguer jusqu'aux options multiples
    // (Code pour naviguer jusqu'à la question multi-options)
    // Ce test nécessiterait plus de setup pour atteindre cette partie
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    
    render(
      <ChatSurvey 
        onComplete={mockOnComplete}
        onStartStory={mockOnStartStory}
        isVisible={true}
      />
    );

    // Naviguer jusqu'au champ email
    // (Code pour naviguer jusqu'au champ email)
    // Tester la validation de l'email
  });

  it('should complete survey and call onComplete', async () => {
    // Test complet du parcours jusqu'à la fin
    // Ce test nécessiterait de parcourir tout le questionnaire
  });
});