// lib/mock-auth.ts
// ============================================================
// EcoSphere – Mock Authentication Utility (No backend)
// PDF Spec: "Mock authentication (static credentials)"
// Credentials: admin@ecosphere.com / demo1234
// Credentials: manager@ecosphere.com / demo1234
// ============================================================

export const MOCK_CREDENTIALS = {
  admin: {
    email: 'admin@ecosphere.com',
    password: 'demo1234',
  },
  manager: {
    email: 'manager@ecosphere.com',
    password: 'demo1234',
  },
  employee: {
    email: 'employee@ecosphere.com',
    password: 'demo1234',
  }
} as const;

export const MOCK_USERS = {
  admin: {
    id: 'usr-001',
    email: 'admin@ecosphere.com',
    name: 'Sunita Joshi',
    role: 'admin',
    department: 'Corporate',
    initials: 'SJ',
  },
  manager: {
    id: 'usr-002',
    email: 'manager@ecosphere.com',
    name: 'David Chen',
    role: 'manager',
    department: 'Engineering',
    initials: 'DC',
  },
  employee: {
    id: 'usr-003',
    email: 'employee@ecosphere.com',
    name: 'Rahul Patel',
    role: 'employee',
    department: 'Engineering',
    initials: 'RP',
  }
};

const SESSION_KEY = 'ecosphere_auth_session';

export function mockSignIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emailLower = email.toLowerCase().trim();
      if (emailLower === MOCK_CREDENTIALS.admin.email && password === MOCK_CREDENTIALS.admin.password) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: MOCK_USERS.admin, ts: Date.now() }));
        resolve();
      } else if (emailLower === MOCK_CREDENTIALS.manager.email && password === MOCK_CREDENTIALS.manager.password) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: MOCK_USERS.manager, ts: Date.now() }));
        resolve();
      } else if (emailLower === MOCK_CREDENTIALS.employee.email && password === MOCK_CREDENTIALS.employee.password) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: MOCK_USERS.employee, ts: Date.now() }));
        resolve();
      } else {
        reject(new Error('Invalid email or password.'));
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
