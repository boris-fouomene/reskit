import { isObj } from "./object";
import isEmpty from "./isEmpty";

export type ISortDirection = "asc" | "desc";

export type IsortColumn<T> = keyof T | string | number | symbol;
/***
 * les options de configuration de la fonction getValue à apperler sur un item donné
 */
export type ISortByGetItemOptions<T = any> = {
  item: T;
  column: IsortColumn<T>;
} & ISortByConfig<T>;

export type ISortByConfig<T = any> = {
  /** la direction du trie */
  dir?: ISortDirection;
  /** le nom de la colonne à utiliser pour le trie si c'est un tableu */
  column?: IsortColumn<T>;
  /** si la casse sera ignorée lors du trie */
  ignoreCase?: boolean;
  /** le nom de la clé unique à chaque item */
  keyName?: string;

  /***
   * la fonction permettant de récupérer à l'instant t la valeur à utiliser pour le trie de l'item item
   */
  getValue?: (options: ISortByGetItemOptions<T>) => any;
};
/**
 *  Trie un tableau d'elements de type T.
* @param  {T} T, le type de données à trier
* @param  {Array<T>} la collection à trier
* @param  {ISortByConfig<T>} config: les options de configuration : 
*    config = {
        dir : 'desc' //la direction du trie
*       column : 'test' //le nom de la colonne à utiliser pour le trie
*       igonoreCase : true //si la casse sera ignorée lors du trie
*    }
* ```ts
*   sortBy([{test:'b'},{test:'b}],{getValue:({item,column})=>item[column],dir:'asc',ignoreCase:false})
* ```	
*/
export const sortBy = function sortby<T = any>(array: Array<T>, config: ISortByConfig<T>): Array<T> {
  if (!isObj(config)) config = {} as ISortByConfig<T>;
  if (!Array.isArray(array)) {
    return [];
  }
  if (!config.dir || !["asc", "desc"].includes(config.dir)) {
    config.dir = "asc";
  }
  const { ignoreCase } = config;
  const multiplicater = !!(config.dir === "desc") ? -1 : 1;
  const getValue = typeof config.getValue === "function" ? config.getValue : ({ column, item }: ISortByGetItemOptions<T>) => (isObj(item) && column in (item as object) ? item[column as keyof typeof item] : item);
  const compare = function (itemA: T, itemB: T) {
    let a: any = getValue({ ...config, item: itemA, column: config.column as keyof T | string });
    if (isEmpty(a)) a = "";
    let b: any = getValue({ ...config, item: itemB, column: config.column as keyof T | string });
    if (isEmpty(b)) b = "";
    const isStringCompare = [typeof a, typeof b].includes("string");
    if (isStringCompare || [typeof a, typeof b].includes("boolean")) {
      a = a?.toString() ?? "";
      b = b?.toString() ?? "";
      if (ignoreCase !== false) {
        a = a.toLowerCase();
        b = b.toLowerCase();
      }
    }
    return multiplicater * (a < b ? -1 : +(a > b));
  };
  return array.sort(compare);
  return mergeSort(array, compare);
};

/**
 * Merge sort, effectue un trie suivant le pricipe diviser pour mieux régner sur les données array
 * @param {T} T, le type de données à trier
 * @param {Array<T>} array, la collection à trier
 * @param {(a:T,b:T)=>number} compare, la fonction de comparaison à appliquer
 * @returns la collection triée
 */
export function mergeSort<T = any>(array: Array<T>, compare: (a: T, b: T) => number): Array<T> {
  if (!Array.isArray(array)) return [];
  const length = array.length,
    middle = Math.floor(length / 2);
  if (!compare) {
    compare = function (left, right) {
      if (left < right) return -1;
      if (left == right) return 0;
      else return 1;
    };
  }
  if (length < 2) return array;
  return merge(mergeSort(array.slice(0, middle), compare), mergeSort(array.slice(middle, length), compare), compare);
}

function merge<T = any>(left: Array<T>, right: Array<T>, compare: (a: T, b: T) => number): Array<T> {
  const result = [];
  while (left.length > 0 || right.length > 0) {
    if (left.length > 0 && right.length > 0) {
      if (compare(left[0], right[0]) <= 0) {
        result.push(left[0]);
        left = left.slice(1);
      } else {
        result.push(right[0]);
        right = right.slice(1);
      }
    } else if (left.length > 0) {
      result.push(left[0]);
      left = left.slice(1);
    } else if (right.length > 0) {
      result.push(right[0]);
      right = right.slice(1);
    }
  }
  return result;
}
