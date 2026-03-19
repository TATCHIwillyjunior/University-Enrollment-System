export interface EventEmitter {
  subscribe<T>(eventType: string, handler: (event: T) => void): void;
  unsubscribe<T>(eventType: string, handler: (event: T) => void): void;
  emit<T>(eventType: string, payload: T): void;
}

export class SimpleEventEmitter implements EventEmitter {
  private handlers: Map<string, Set<(event: unknown) => void>> = new Map();

  subscribe<T>(eventType: string, handler: (event: T) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as (event: unknown) => void);
  }

  unsubscribe<T>(eventType: string, handler: (event: T) => void): void {
    this.handlers.get(eventType)?.delete(handler as (event: unknown) => void);
  }

  emit<T>(eventType: string, payload: T): void {
    this.handlers.get(eventType)?.forEach((handler) => handler(payload));
  }
}

export const globalEventEmitter = new SimpleEventEmitter();
