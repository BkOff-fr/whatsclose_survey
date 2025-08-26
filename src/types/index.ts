// Survey Types
export interface UserData {
  firstName: string;
  lastName?: string;
  email: string;
  city: string;
  localConsumption?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  impressedBy?: string[];
  subscription?: 'yes' | 'maybe' | 'no';
}

export interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp?: Date;
}

export interface ChatOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value?: any;
}

export interface Question {
  type: 'bot' | 'input' | 'options' | 'multi-options' | 'story';
  content: string | ((data: UserData) => string);
  field?: keyof UserData;
  placeholder?: string;
  inputType?: string;
  options?: ChatOption[];
  triggerStory?: boolean;
  final?: boolean;
  delay?: number;
}

// 3D Scene Types
export interface SceneProps {
  position: [number, number, number];
  onClick?: () => void;
  isActive?: boolean;
}

export interface CameraPosition {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}

export interface SceneConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  position: CameraPosition;
}

// Experience Types
export type ExperienceMode = 'chat' | 'story';

export interface ExperienceState {
  mode: ExperienceMode;
  currentScene: number;
  surveyCompleted: boolean;
  userData: UserData | null;
}

// API Types
export interface SurveySubmission {
  success: boolean;
  message: string;
  data?: {
    firstName: string;
    city: string;
  };
  error?: string;
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

// Store Types (Zustand)
export interface SurveyStore {
  userData: UserData;
  currentStep: number;
  progress: number;
  isCompleted: boolean;
  mode: ExperienceMode;
  currentScene: number;
  
  // Actions
  updateUserData: (data: Partial<UserData>) => void;
  setCurrentStep: (step: number) => void;
  setProgress: (progress: number) => void;
  setMode: (mode: ExperienceMode) => void;
  setCurrentScene: (scene: number) => void;
  resetSurvey: () => void;
  markAsCompleted: () => void;
}

// Component Props Types
export interface ChatSurveyProps {
  onComplete: (data: UserData) => void;
  onStartStory: () => void;
  isVisible: boolean;
}

export interface StoryNavigationProps {
  currentScene: number;
  totalScenes: number;
  onNavigate: (scene: number) => void;
  onBackToChat: () => void;
}

export interface CameraControllerProps {
  mode: ExperienceMode;
  sceneIndex: number;
}

export interface Scene3DProps {
  mode: ExperienceMode;
}

export interface SuccessScreenProps {
  userData: UserData;
  onRestart?: () => void;
}