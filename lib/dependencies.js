class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToTail(val) {
    const newNode = {
      next: null,
      value: val,
    };
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    if (this.head.next === null) {
      this.head.next = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
  }

  removeHead() {
    if (this.head === null) return;
    if (this.head.next === null) {
      const head = this.head;
      this.head = null;
      this.tail = null;
      return head.value;
    }
    const value = this.head.value;
    this.head = this.head.next;
    return value;
  }

  contains(val) {
    if (this.head === null) return false;
    const searchLinkedList = (node) => {
      if (node.value === val) return true;
      if (node.next === null) return false;
      return searchLinkedList(node.next);
    };
    return searchLinkedList(this.head);
  }
}

class Queue {
  constructor() {
    this.storage = [];
  }

  enqueue(item) {
    this.storage.push(item);
  }

  dequeue() {
    return this.storage.shift();
  }

  get size() {
    return this.storage.length;
  }
}

class Stack {
  constructor() {
    this.storage = [];
  }

  get size() {
    return this.storage.length;
  }

  add(item) {
    this.storage.push(item);
  }

  remove() {
    return this.storage.pop();
  }
}

class LimitedArray {
  constructor(limit) {
    this.storage = [];
    this.limit = limit;
  }

  checkLimit(index) {
    if (typeof index !== 'number') throw new Error('The supplied index needs to be a number');
    if (this.limit <= index) {
      throw new Error('The supplied index lies out of the array\'s bounds');
    }
  }

  each(cb) {
    for (let i = 0; i < this.storage.length; i++) {
      cb(this.storage[i], i);
    }
  }

  get(index) {
    this.checkLimit(index);
    return this.storage[index];
  }

  get length() {
    return this.storage.length;
  }

  set(index, value) {
    this.checkLimit(index);
    this.storage[index] = value;
  }
}

const getIndexBelowMax = (str, max) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
    hash = Math.abs(hash);
  }
  return hash % max;
};

class HashTable {
  constructor() {
    this.limit = 8;
    this.storage = new LimitedArray(this.limit);
  }

  checkCapacity() {
    let fullCells = 1;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    if (fullCells / this.limit > 0.75) return true;
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (bucket === undefined) return;
      bucket.forEach((pair) => {
        this.insert(pair[0], pair[1]);
      });
    });
  }

  insert(key, value) {
    if (this.checkCapacity()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);

    if (bucket === undefined) {
      this.storage.set(index, [[key, value]]);
      return;
    }

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        this.storage.set(index, bucket);
        return;
      }
    }

    bucket.push([key, value]);
    this.storage.set(index, bucket);
  }

  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket.length === 1) return this.storage.set(index, undefined);
    bucket.forEach((pair, i) => {
      if (pair[0] === key) bucket.splice(i, 1);
      this.storage.set(index, bucket);
    });
  }

  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket === undefined) return undefined;
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }
  }
}

module.exports = {
    LinkedList,
    Queue,
    Stack,
    HashTable
};