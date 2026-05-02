import { apiClient } from '../api/client';

export type LogStack = 'frontend' | 'backend';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogPackage = 
  // Frontend only
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  // Both
  | 'auth' | 'config' | 'middleware' | 'utils'
  // Backend only
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service';

export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

/**
 * Reusable Logging Middleware Function
 * Sends logs to the Evaluation Server if authenticated,
 * and outputs to the console as a fallback/development tool.
 */
export const Log = async (
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> => {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  // Local console logging based on level
  switch (level) {
    case 'error':
    case 'fatal':
      console.error(`[${stack.toUpperCase()}] [${pkg}] ${message}`);
      break;
    case 'warn':
      console.warn(`[${stack.toUpperCase()}] [${pkg}] ${message}`);
      break;
    case 'info':
      console.info(`[${stack.toUpperCase()}] [${pkg}] ${message}`);
      break;
    default:
      console.log(`[${stack.toUpperCase()}] [${pkg}] ${message}`);
  }

  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('Logging Middleware: No access token found. Cannot send log to server.');
      return;
    }

    await apiClient.post('/evaluation-service/logs', payload);
  } catch (error) {
    console.error('Logging Middleware: Failed to send log to remote server', error);
  }
};
