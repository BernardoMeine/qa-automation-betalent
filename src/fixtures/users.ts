export interface UserCredentials {
  username: string;
  password: string;
  description: string;
  shouldLoginSucceed: boolean;
}

const DEFAULT_PASSWORD = 'secret_sauce';

export const users: Record<string, UserCredentials> = {
  standard: {
    username: 'standard_user',
    password: DEFAULT_PASSWORD,
    description: 'Standard user with full access',
    shouldLoginSucceed: true,
  },
  lockedOut: {
    username: 'locked_out_user',
    password: DEFAULT_PASSWORD,
    description: 'Locked out user - cannot login',
    shouldLoginSucceed: false,
  },
  problem: {
    username: 'problem_user',
    password: DEFAULT_PASSWORD,
    description: 'Problem user - broken images and forms',
    shouldLoginSucceed: true,
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: DEFAULT_PASSWORD,
    description: 'Performance glitch user - slow responses',
    shouldLoginSucceed: true,
  },
  error: {
    username: 'error_user',
    password: DEFAULT_PASSWORD,
    description: 'Error user - throws errors on certain actions',
    shouldLoginSucceed: true,
  },
  visual: {
    username: 'visual_user',
    password: DEFAULT_PASSWORD,
    description: 'Visual user - UI misalignment issues',
    shouldLoginSucceed: true,
  },
};

export const invalidCredentials = {
  wrongUsername: {
    username: 'invalid_user',
    password: DEFAULT_PASSWORD,
    description: 'Non-existent username',
  },
  wrongPassword: {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid username with wrong password',
  },
  emptyUsername: {
    username: '',
    password: DEFAULT_PASSWORD,
    description: 'Empty username field',
  },
  emptyPassword: {
    username: 'standard_user',
    password: '',
    description: 'Empty password field',
  },
  bothEmpty: {
    username: '',
    password: '',
    description: 'Both fields empty',
  },
};
