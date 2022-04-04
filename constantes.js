export const app_url = "https://ferreteria-movil.herokuapp.com";
/**
 *
 * @param {any} obj1 any
 * @param {any} obj2 any
 * @returns retorna un valor buleano indicando si los objetos recibidos son iguales(true) o no(false)
 */
export function compareObjs(obj1 = { name: "name" }, obj2 = { name: "name" }) {
  let res = true;
  Object.keys(obj1).forEach((k) => {
    if (obj1[k] != obj2[k]) {
      res = false;
      return res;
    }
  });
  return res;
}

export function objsDiff(obj1 = { name: "name" }, obj2 = { name: "name" }) {
  let diff = {};
  Object.keys(obj1).forEach((k) => {
    if (obj1[k] != obj2[k]) {
      diff[k] = obj2[k];
    }
  });
  return diff;
}
