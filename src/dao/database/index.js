"use client";
import expense from "@/models/expense";
import category from "@/models/category";

const DB_NAME = "money-database.db";
const DB_VERSION = 3;
const tables = [
  { name: "expenses", model: expense },
  { name: "categories", model: category },
];

const Database = (table) => {
  /**
   * @callback onsuccess
   * @param {IDBDatabase} database
   */
  /**
   * @callback onerror
   * @param {Event} event
   */
  /**
   * @param {onsuccess} onsuccess
   * @param {onerror} onerror
   */
  const open = (onsuccess, onerror) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = init;
    request.onsuccess = () => onsuccess(request.result);
    request.onerror = (event) => onerror(event);
  };

  /**
   * Get First element that match the key
   * @param {any} key to be searched
   * @returns {any|null} First element or null
   */
  const getOneById = async (key) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const request = obj.get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = reject;
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Get First element that match the value of the index
   * @param {any} index key
   * @param {any} value of the index
   * @returns {any|null} First element or null
   */
  const getOne = async (index, value) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const idx = obj.index(index);
          const request = idx.get(value);
          request.onsuccess = () => resolve(request.result);
          request.onerror = reject;
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Get Last element
   * @param {any} index key
   * @returns {any|null} Last element or null
   */
  const getLast = async () =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const oc = obj.openCursor("prev");
          oc.error = reject;
          oc.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return resolve(null);
            else resolve(cursor.value);
          };
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Get all the objects storaged in the Database
   * @param {any} index key
   * @returns {any[]} Array with the table object
   */
  const getAll = async (index) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readonly");
          transaction.onerror = (event) => {
            reject(event);
          };

          const obj = transaction.objectStore(table);
          const idx = obj.index(index);
          const request = idx.getAll();
          request.onerror = reject;
          request.onsuccess = () => resolve(request.result);
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Get all the objects storaged in the Database
   * @returns {any[]} Array with the table object
   */
  const getAllById = async () =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const request = obj.getAll();
          request.onerror = reject;
          request.onsuccess = () => resolve(request.result);
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * @callback range
   * @param {any} lower
   * @param {any} upper
   * @param {any} lowerOpen
   * @param {any} upperOpen
   */
  /**
   * Get all the objects stored in a specific range
   * @param {range} range
   * @param {"next"|"prev"} direction: prev descending order and next ascending order
   * @returns
   */
  const getRangeById = async (range, direction) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          let bound = undefined;
          if (range) {
            const { lower, upper, lowerOpen, upperOpen } = range;
            bound = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
          }

          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const oc = obj.openCursor(bound, direction);
          oc.error = reject;
          const result = [];
          oc.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return resolve(result);
            result.push(cursor.value);
            cursor.continue();
          };
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Get all the objects stored in a specific range
   * @param {any} lower
   * @param {any} upper
   * @param {any} lowerOpen
   * @param {any} upperOpen
   * @param {"next"|"prev"} direction: prev descending order and next ascending order
   * @returns
   */
  const getRange = async (index, range, direction) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          let bound = undefined;
          if (range) {
            const { lower, upper, lowerOpen, upperOpen } = range;
            bound = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
          }

          const transaction = db.transaction(table, "readonly");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const idx = obj.index(index);
          const oc = idx.openCursor(bound, direction);
          oc.onerror = reject;
          const result = [];
          oc.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) return resolve(result);
            result.push(cursor.value);
            cursor.continue();
          };
        },
        (event) => {
          reject(event);
        }
      )
    );

  /**
   * Insert the given value in the database,
   * if the key already exists the value will be updated
   * @param {T} value
   * @param {T} key
   * @returns {T} The valid key inserted in the database
   */
  const put = async (value, key) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readwrite");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const validKey = obj.put(value, key);
          validKey.onerror = reject;
          validKey.onsuccess = () => resolve(validKey.result);
        },
        (event) => {
          reject(event);
        }
      )
    );

  const remove = async (key) =>
    new Promise((resolve, reject) =>
      open(
        (db) => {
          const transaction = db.transaction(table, "readwrite");
          transaction.onerror = reject;

          const obj = transaction.objectStore(table);
          const request = obj.delete(key);
          request.onerror = reject;
          request.onsuccess = () => resolve(request.result);
        },
        (event) => {
          reject(event);
        }
      )
    );

  const init = ({ target: { result } }) => {
    const db = result;
    for (const { name, model } of tables) {
      let keyPath = null;
      let indexes = [];
      for (const [key, obj] of Object.entries(model)) {
        const { primaryKey, indexed, unique } = obj;
        if (primaryKey) keyPath = key;
        if (indexed || unique) indexes.push({ key, unique });
      }
      const obj = db.createObjectStore(name, {
        autoIncrement: true,
        keyPath,
      });
      obj.createIndex(keyPath, keyPath, { unique: true });
      for (const { key, unique } of indexes) {
        obj.createIndex(key, key, { unique });
      }
    }
  };

  return {
    put,
    getOne,
    getLast,
    getOneById,
    getAll,
    getAllById,
    getRangeById,
    getRange,
    remove,
  };
};

export default Database;
