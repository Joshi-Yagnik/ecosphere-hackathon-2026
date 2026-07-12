// lib/mock-auth.ts
// ============================================================
// EcoSphere – Mock Authentication Utility (No backend)
// PDF Spec: "Mock authentication (static credentials)"
// Credentials: admin@ecosphere.com / demo1234
// ============================================================

export const MOCK_CREDENTIALS = {
  email: 'admin@ecosphere.com',
  password: 'demo1234',
} as const;

export const MOCK_USER = {
  id: 'usr-001',
  email: 'admin@ecosphere.com',
  name: 'Sunita Joshi',
  role: 'ESG Manager',
  department: 'Finance',
  initials: 'SJ',
};

const SESSION_KEY = 'ecosphere_auth_session';

export function mockSignIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email.toLowerCase().trim() === MOCK_CREDENTIALS.email &&
        password === MOCK_CREDENTIALS.password
      ) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: MOCK_USER, ts: Date.now() }));
        resolve();
      } else {
        reject(new Error('Invalid email or password. Use admin@ecosphere.com / demo1234'));
      }
    }, 600);
  });
}

export function mockSignOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function mockGetSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!mockGetSession();
}
