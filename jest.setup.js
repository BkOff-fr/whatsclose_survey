// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock pour IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock pour ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour requestAnimationFrame
global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
  return 0;
};

global.cancelAnimationFrame = () => {};

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock pour sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = sessionStorageMock;

// Mock pour WebGL
HTMLCanvasElement.prototype.getContext = jest.fn();

// Variables d'environnement pour les tests
process.env.NEXT_PUBLIC_APP_NAME = 'WhatsClose Test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_API_URL = '/api';

// Silence console during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});