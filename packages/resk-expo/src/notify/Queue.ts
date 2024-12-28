/**
 * Represents a queue data structure that allows adding and removing items in a FIFO (First In, First Out) manner.
 * 
 * This class provides methods to enqueue (add) items to the queue, dequeue (remove) items from the queue,
 * check the size of the queue, and clear all items from the queue.
 * 
 * @example
 * const queue = new Queue();
 * queue.enqueue('item1'); // Adds 'item1' to the queue
 * queue.enqueue('item2'); // Adds 'item2' to the queue
 * console.log(queue.size); // Output: 2
 * console.log(queue.firstItem); // Output: 'item1'
 * console.log(queue.dequeue()); // Output: 'item1'
 * console.log(queue.isEmpty); // Output: false
 * queue.clear(); // Empties the queue
 * console.log(queue.isEmpty); // Output: true
 */
export default class Queue {
  data: any[];
  constructor() {
    this.data = [];
  }
  get firstItem() {
    if (!this.isEmpty) {
      return this.data[0];
    }
    return null;
  }
  get size() {
    return this.data.length;
  }
  get isEmpty() {
    return this.size === 0;
  }
  enqueue(item: any) {
    this.data.push(item);
  }
  dequeue() {
    if (!this.isEmpty) {
      return this.data.shift();
    }
    return null;
  }
  clear() {
    this.data = [];
  }
}