import { IAccessibilityEscapeHandler, IAccessibilityEscapeOptions } from './types';

export class AccessibilityEscapeManager {
  private handlers = new Map<HTMLElement, Array<{
    handler: IAccessibilityEscapeHandler;
    priority: number;
    enabled: boolean;
    stopPropagation: boolean;
    preventDefault: boolean;
  }>>();
  private static instance : AccessibilityEscapeManager | null = null;
  static getInstance() : AccessibilityEscapeManager {
    if(!this.instance){
      this.instance = new AccessibilityEscapeManager();
    }
    return this.instance;
  }
  private globalListener: ((event: KeyboardEvent) => void) | null = null;
  register(
    element: HTMLElement,
    handler: IAccessibilityEscapeHandler,
    options: IAccessibilityEscapeOptions = {}
  ): {remove:Function} {
    const {
      priority = 0,
      enabled = true,
      stopPropagation = true,
      preventDefault = true
    } = Object.assign({},options);

    if (!this.handlers.has(element)) {
      this.handlers.set(element, []);
    }
    const elementHandlers = this.handlers.get(element)!;
    elementHandlers.push({
      handler,
      priority,
      enabled,
      stopPropagation,
      preventDefault
    });

    // Sort by priority (higher first)
    elementHandlers.sort((a, b) => b.priority - a.priority);
    this.ensureGlobalListener();

    return {remove:()=>{
      return this.unregister(element,handler);
    }}
  }

  unregister(element: HTMLElement, handler: IAccessibilityEscapeHandler) {
    const elementHandlers = this.handlers.get(element);
    if (elementHandlers) {
      const index = elementHandlers.findIndex(h => h.handler === handler);
      if (index > -1) {
        elementHandlers.splice(index, 1);
      }
      if (elementHandlers.length === 0) {
        this.handlers.delete(element);
      }
    }

    if (this.handlers.size === 0) {
      this.removeGlobalListener();
    }
  }

  private ensureGlobalListener() {
    if (!this.globalListener && typeof window !== 'undefined') {
      this.globalListener = this.handleGlobalEscape.bind(this);
      document.addEventListener('keydown', this.globalListener, true);
    }
  }

  private removeGlobalListener() {
    if (this.globalListener && typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.globalListener, true);
      this.globalListener = null;
    }
  }

  private handleGlobalEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement;
      
      // Find the most relevant element (closest ancestor with handlers)
      let targetElement: HTMLElement | null = activeElement;
      let relevantHandlers: Array<{
        handler: IAccessibilityEscapeHandler;
        priority: number;
        enabled: boolean;
        stopPropagation: boolean;
        preventDefault: boolean;
      }> = [];

      while (targetElement && relevantHandlers.length === 0) {
        if (this.handlers.has(targetElement)) {
          relevantHandlers = this.handlers.get(targetElement)!.filter(h => h.enabled);
        }
        targetElement = targetElement.parentElement;
      }

      // Execute handlers in priority order
      for (const handlerInfo of relevantHandlers) {
        const result = (handlerInfo as any).handler(event);
        if (result !== false) {
          if (handlerInfo.preventDefault) {
            event.preventDefault();
          }
          if (handlerInfo.stopPropagation) {
            event.stopPropagation();
          }
          break; // Stop after first successful handler
        }
      }
    }
  }
  destroy() {
    this.removeGlobalListener();
    this.handlers.clear();
  }
}