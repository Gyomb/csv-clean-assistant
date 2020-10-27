/**
 * This function modifies the provided array by moving one of its items.
 * If the indexes passed as parameters exceed the boundaries of the array, the closest boundary will be used instead.
 * @param {Array} arr // the array you wish to modify
 * @param {Number} oldId // the initial index of the item
 * @param {Number} newId // the final index of the item
 */
export const moveInArray = function (arr, oldId, newId) {
  while (oldId < 0) {
    oldId += arr.length
  }
  while (oldId > arr.length) {
    oldId -= arr.length
  }
  while (newId < 0) {
    newId += arr.length
  }
  while (newId > arr.length) {
    newId -= arr.length
  }
  arr.splice(newId, 0, arr.splice(oldId, 1)[0])
}

/**
 * This function transposes a given array of objects into an object of arrays and return said object. All arrays are set to have the same length and if an item misses a property, a "undefined" value is inserted instead on the corresponding array.
 * @param {Array} arr // the array to transpose
 * @param {*} [filler = undefined] // the value applied when filling arrays (to handle non-uniform objects and keep every value extracted from a given object at the same index)
 */
export const transposeArrayOfObjects = function (arr, filler) {
  const objectOfArrays = {}
  for (let arrIdx = 0; arrIdx < arr.length; arrIdx++) {
    const arrItem = arr[arrIdx]
    const arrItemKeys = Object.keys(arrItem)
    const objOfArrKeys = Object.keys(objectOfArrays)
    objOfArrKeys.forEach(objOfArrKey => {
      const itemIdenticalKeyIdx = arrItemKeys.indexOf(objOfArrKey)
      // we assume that all arrays are the same length (so no need to check for their length and fill them)
      if (itemIdenticalKeyIdx !== -1) {
        objectOfArrays[objOfArrKey].push(arrItem[objOfArrKey])
        arrItemKeys.splice(itemIdenticalKeyIdx, 1)
      } else {
        objectOfArrays[objOfArrKey].push(filler)
      }
    })
    arrItemKeys.forEach(arrItemKey => {
      // create a new array with the appropriate number of entries, using the filler value
      objectOfArrays[arrItemKey] = Array(arrIdx).fill(filler)
      objectOfArrays[arrItemKey].push(arrItem[arrItemKey])
    })
  }
  return objectOfArrays
}
