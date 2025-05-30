/**
 * Represents the base keys that can be handled by the keyboard event handler.
 * 
 * This type includes a variety of common keyboard keys, such as:
 * - Control keys (e.g., 'backspace', 'delete', 'insert', 'tab', 'enter', etc.)
 * - Navigation keys (e.g., 'left', 'up', 'right', 'down', 'home', 'end', etc.)
 * - Modifier keys (e.g., 'shift', 'ctrl', 'alt', etc.)
 * 
 * This type can be extended with additional keys as needed.
 * 
 * @example
 * ```typescript
 * const key: IKeyboardEventHandlerBaseKey = 'enter'; // Valid key
 * const anotherKey: IKeyboardEventHandlerBaseKey = 'backspace'; // Valid key
 * const invalidKey: IKeyboardEventHandlerBaseKey = 'unknown'; // TypeScript will throw an error
 * ```
 */
export type IKeyboardEventHandlerBaseKey =
  'backspace' |
  '"' |
  'del' |
  '\'' |
  ',' |
  'delete' |
  'ins' |
  'insert' |
  'tab' |
  'enter' |
  'return' |
  'esc' |
  'space' |
  'pageup' |
  'pagedown' |
  'end' |
  'home' |
  'left' |
  'up' |
  'right' |
  'down' |
  'shift' |
  'ctrl' |
  'alt' |
  'cap' |
  'num' |
  'clear' |
  'meta' |
  ';' |
  '=' |
  '|' |
  '-' |
  'minus' |
  '.' |
  '/' |
  '`' |
  '[' |
  '\\' |
  ']' |
  '*' |
  '+' |
  'plus' |
  '\\' |
  'quote' |
  string;

/**
 * Represents the modifier keys that can be used in keyboard event handling.
 * 
 * This type includes common modifier keys such as:
 * - 'control' or 'ctrl'
 * - 'command' or 'cmd'
 * - 'shift'
 * - 'meta'
 * - 'option' or 'alt'
 * 
 * These keys can be combined with base keys to create complex key combinations.
 * 
 * @example
 * ```typescript
 * const modifier: IKeyboardEventHandlerModifierKeys = 'ctrl'; // Valid modifier
 * const anotherModifier: IKeyboardEventHandlerModifierKeys = 'shift'; // Valid modifier
 * const invalidModifier: IKeyboardEventHandlerModifierKeys = 'unknown'; // TypeScript will throw an error
 * ```
 */
export type IKeyboardEventHandlerModifierKeys =
  'control' |
  'ctrl' |
  'command' |
  'shift' |
  'meta' |
  'cmd' |
  'option' |
  'alt';

/**
 * Represents a key that can be handled by the keyboard event handler, 
 * which can be either a base key or a combination of modifier keys and a base key.
 * 
 * This type allows for the definition of complex key combinations, such as:
 * - 'ctrl+a' (Control + A)
 * - 'shift+tab' (Shift + Tab)
 * - 'alt+f4' (Alt + F4)
 * 
 * @example
 * ```typescript
 * const keyCombination: IKeyboardEventHandlerKey = 'ctrl+z'; // Valid combination
 * const anotherKeyCombination: IKeyboardEventHandlerKey = 'shift+enter'; // Valid combination
 * const baseKey: IKeyboardEventHandlerKey = 'space'; // Valid base key
 * ```
 */
export type IKeyboardEventHandlerKey =
  `${IKeyboardEventHandlerModifierKeys}+${IKeyboardEventHandlerBaseKey}` |
  IKeyboardEventHandlerBaseKey;

const commonKeys: { [key in IKeyboardEventHandlerBaseKey]: number[] } = {
  backspace: [8],
  del: [46],
  delete: [46],
  ins: [45],
  insert: [45],
  tab: [9],
  enter: [13],
  return: [13],
  esc: [27],
  space: [32],
  pageup: [33],
  pagedown: [34],
  end: [35],
  home: [36],
  left: [37],
  up: [38],
  right: [39],
  down: [40],
  shift: [16],
  ctrl: [17],
  alt: [18],
  cap: [20],
  num: [144],
  clear: [12],
  meta: [91],
  ';': [186, 59],
  '=': [187, 61],
  ',': [188, 44],
  '-': [189, 45, 173, 109],
  'minus': [189, 45, 173, 109],
  '.': [190, 110],
  '/': [191, 111],
  '`': [192],
  '[': [219],
  '\\': [220],
  ']': [221],
  '*': [106],
  '+': [107],
  'plus': [107],
  '\'': [222],
  'quote': [222],
  "\"|\"": [],
  "|": []
};

const commonKeysInUpperCases = Object.keys(commonKeys)
  .reduce((accumulator, current) =>
    Object.assign(accumulator, { [current.toUpperCase()]: commonKeys[current as IKeyboardEventHandlerBaseKey] }), {});


const numberKeys = '0123456789'.split('')
  .reduce((accumulator, current, index) =>
    Object.assign(accumulator, { [current]: [index + 48, index + 96] }), {});


const letterKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  .reduce((accumulator, current, index) =>
    Object.assign(
      accumulator,
      { [current.toLowerCase()]: [index + 65] },
      { [current]: [index + 65] }), {});

const fnKeys = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19'.split(',')
  .reduce((accumulator, current, index) =>
    Object.assign(accumulator, { [`f${current}`]: [index + 112] }), {});



const modifierKeys: { [key: string]: string } = {
  control: 'ctrl',
  ctrl: 'ctrl',
  shift: 'shift',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  option: 'alt',
  alt: 'alt',
};

const AllKeys = Object.assign({}, commonKeys, commonKeysInUpperCases, numberKeys, letterKeys, fnKeys);
const alphanumericKeys = Object.assign({}, numberKeys, letterKeys);

const aliasKeys: { [key: string]: string[] } = {
  all: Object.keys(AllKeys),
  alphanumeric: Object.keys(alphanumericKeys),
  numeric: Object.keys(numberKeys),
  alphabetic: Object.keys(letterKeys),
  function: Object.keys(fnKeys),
};

function matchKeyEvent(event: any, keyName: IKeyboardEventHandlerKey) {
  const eventKeyCode = event && ("which" in event ? event.which : "keyCode" in event ? event.keyCode : "") || '';
  const eventType = event.type;
  const eventModifiers = Object.keys(modifierKeys).filter(modKey => event[`${modKey}Key`]).sort();
  const cleanKeyName = keyName.toLowerCase().trim();
  const keyNameParts = cleanKeyName === '+' ? ['+'] : cleanKeyName.split(/\s?\+\s?/); // e.g. 'crtl + a'
  const mainKeyName = keyNameParts.pop();
  const mainKeyCode = AllKeys[mainKeyName as string];
  const modifierKeyNames = keyNameParts;

  if (eventType === 'keypress') {
    const eventKeyCodeString = String.fromCharCode(eventKeyCode);
    return keyName == eventKeyCodeString.toLowerCase();
  }

  if (mainKeyCode && modifierKeyNames.length === 0 && eventModifiers.length === 0) {
    return mainKeyCode.indexOf(eventKeyCode) >= 0;
  }

  if (mainKeyCode && modifierKeyNames.length > 0 && eventModifiers.length > 0) {
    const modifiers = modifierKeyNames.map(modKey => modifierKeys[modKey as string]).sort();
    const modifiersMatched = modifiers.length === eventModifiers.length &&
      modifiers.every((modKey, index) => eventModifiers[index] === modKey);

    return mainKeyCode.indexOf(eventKeyCode) >= 0 && modifiersMatched;
  }

  if (modifierKeyNames.length == 0 && eventModifiers.length === 1) {
    return mainKeyName === eventModifiers[0];
  }

  return false;
}

/**
* Finds the matched key from a keyboard event based on the provided keys.
* 
* This function takes a keyboard event and an array of keys, and checks if any of the keys
* match the event. It also supports key aliases and can return a special value if 'all' is included
* in the keys array.
* 
* @param event - The keyboard event to check against the provided keys. 
*                This can be any event object that contains key information.
*                Example: 
*                ```typescript
*                const event = { key: 'Enter', type: 'keydown' };
*                ```
* @param keys - An array of keys to match against the event. 
*               This can include base keys, modifier keys, or aliases.
*               Example: 
*               ```typescript
*               const keys = ['enter', 'space', 'ctrl+a', 'all'];
*               ```
* 
* @returns The matched key as an `IKeyboardEventHandlerKey`. 
*          If no key matches and 'all' is included in the keys, it returns 'other'.
*          If no match is found, it returns `undefined`.
* 
* @example
* ```typescript
* const event = { key: 'Enter', type: 'keydown' };
* const keys = ['enter', 'space', 'ctrl+a'];
* const matchedKey = findMatchedKey(event, keys);
* console.log(matchedKey); // Output: 'enter'
* ```
* 
* @example
* ```typescript
* const event = { key: 'Escape', type: 'keydown' };
* const keys = ['all'];
* const matchedKey = findMatchedKey(event, keys);
* console.log(matchedKey); // Output: 'other'
* ```
*/
export function findMatchedKey(event: any, keys: string[]): IKeyboardEventHandlerKey {
  const lookupAlias = (k: string) => {
    const lowerK = k.toLowerCase();
    const found = aliasKeys[lowerK as string];
    return found ? found : [k];
  };

  const expandedKeys = keys.map(lookupAlias).reduce((a, b) => a.concat(b), []);

  let matchedKey = expandedKeys.find(k => matchKeyEvent(event, k as IKeyboardEventHandlerKey));

  if (!matchedKey && keys.includes('all')) {
    matchedKey = 'other';
  }
  return matchedKey as IKeyboardEventHandlerKey;
}