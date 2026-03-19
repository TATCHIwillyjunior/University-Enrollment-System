export type EventHandler<T> = (event: T) => void;

const handlers = new Map<string, Set<EventHandler<unknown>>>();

export const globalEventEmitter = {
  subscribe<T>(eventType: string, handler: EventHandler<T>) {
    if (!handlers.has(eventType)) {
      handlers.set(eventType, new Set());
    }
    handlers.get(eventType)!.add(handler as EventHandler<unknown>);
  },

  unsubscribe<T>(eventType: string, handler: EventHandler<T>) {
    handlers.get(eventType)?.delete(handler as EventHandler<unknown>);
  },

  emit<T>(eventType: string, payload: T) {
    handlers.get(eventType)?.forEach(handler => handler(payload));
  }
};
