import { test } from '@playwright/test';

/**
 * Extract parameter names and default values from a function
 */
function extractFunctionParamNames(fn: Function): { paramNames: string[]; defaultValues: any[] } {
  const fnStr = fn.toString();
  const match = fnStr.match(/\(([^)]*)\)/);
  
  if (!match || !match[1].trim()) {
    return { paramNames: [], defaultValues: [] };
  }

  const params = match[1].split(',').map(p => p.trim());
  const paramNames: string[] = [];
  const defaultValues: any[] = [];

  params.forEach(param => {
    const [name, defaultValue] = param.split('=').map(p => p.trim());
    const cleanName = name.split(':')[0].trim();
    paramNames.push(cleanName);
    
    if (defaultValue) {
      try {
        defaultValues.push(eval(defaultValue));
      } catch {
        defaultValues.push(undefined);
      }
    } else {
      defaultValues.push(undefined);
    }
  });

  return { paramNames, defaultValues };
}

/**
 * Replace placeholders like {argName} with actual argument values
 */
function replacePlaceholders(
  template: string, 
  args: any[], 
  paramNames: string[], 
  defaultValues: any[]
): string {
  let result = template;
  
  paramNames.forEach((paramName, index) => {
    const value = args[index] !== undefined ? args[index] : defaultValues[index];
    const placeholder = `{${paramName}}`;
    
    if (result.includes(placeholder)) {
      result = result.replace(new RegExp(`\\{${paramName}\\}`, 'g'), String(value));
    }
  });
  
  return result;
}

/**
 * Get the original class name from the instance
 */
function getOriginalClass(instance: any, methodName: string): string {
  if (!instance || !instance.constructor) {
    return 'Unknown';
  }
  return instance.constructor.name;
}

export function step<T>(_stepName?: string) {
  return function (target: (...args: any[]) => Promise<T>, context: ClassMethodDecoratorContext) {
    return function (this: any, ...args: any[]): Promise<T> {
      const isStatic = typeof this === 'function';
      const className = isStatic ? this.name : getOriginalClass(this, context.name.toString());
      const methodDetails = `${className}.${context.name.toString()}`;

      const { paramNames, defaultValues } = extractFunctionParamNames(target);

      const name = _stepName 
        ? `${replacePlaceholders(_stepName, args, paramNames, defaultValues)} - ${methodDetails}`
        : methodDetails;

      const error = new Error('Capturing stack trace');
      const stackLines = error.stack?.split('\n') || [];
      const stack = stackLines.find(line => line.includes('.ts:') && !line.includes('step-decorator.ts'));
      const filePath = stack?.match(/tests\/(.+)/);
      const finalPath = filePath ? `.../${filePath[1]}` : null;

      const stepNameWithStack = `${name} — ${finalPath}`;

      return test.step(stepNameWithStack, async () => {
        return await target.call(this, ...args) as T;
      });
    };
  };
}