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

  // Local console logging is completely removed to comply with Stage 2 rules:
  // "Use of inbuilt language loggers or console logging is not allowed."

  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Cannot use console.warn
      return;
    }

    await apiClient.post('/evaluation-service/logs', payload);
  } catch (error) {
    // Cannot use console.error
  }
};
