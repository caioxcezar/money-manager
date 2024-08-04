export const firstUppercase = (value) => {
  value = value[0].toUpperCase() + value.substr(1, value.length);
  return value.replace(/([A-Z]+)/g, " $1").replace(/^ /, "");
};
