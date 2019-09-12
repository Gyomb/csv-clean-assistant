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
