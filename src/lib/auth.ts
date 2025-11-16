import bcrypt from 'bcrypt';

// Simulamos una base de datos de usuarios
export const users = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$10$slY.H8dJdTl0fCrStYQVIeK7Wy0Mzz1e9mK1e8cX0p9cL4R8zHyNi', // 'password123'
    image: null,
  },
];

// Rastrear intentos fallidos de login
export const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compara una contraseña en texto plano con su hash
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Busca un usuario por email
 */
export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}

/**
 * Crea un nuevo usuario con contraseña hasheada
 */
export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: String(users.length + 1),
    email,
    name,
    password: hashedPassword,
    image: null,
  };
  users.push(newUser);
  return newUser;
}

/**
 * Verifica y registra intentos fallidos de login
 * Retorna true si el usuario está bloqueado
 */
export function isUserBlocked(email: string): boolean {
  const attempt = loginAttempts.get(email);
  if (!attempt) return false;

  // Si pasó el tiempo de bloqueo, limpiar el registro
  if (Date.now() - attempt.timestamp > BLOCK_TIME_MS) {
    loginAttempts.delete(email);
    return false;
  }

  // Si se superó el máximo de intentos, está bloqueado
  return attempt.count >= MAX_ATTEMPTS;
}

/**
 * Registra un intento fallido de login
 */
export function recordFailedAttempt(email: string): void {
  const attempt = loginAttempts.get(email);
  if (attempt) {
    // Si pasó el tiempo de bloqueo, reiniciar el contador
    if (Date.now() - attempt.timestamp > BLOCK_TIME_MS) {
      loginAttempts.set(email, { count: 1, timestamp: Date.now() });
    } else {
      attempt.count++;
    }
  } else {
    loginAttempts.set(email, { count: 1, timestamp: Date.now() });
  }
}

/**
 * Limpia los intentos fallidos después de un login exitoso
 */
export function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}
