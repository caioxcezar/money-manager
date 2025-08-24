export const firstUppercase = (value: string) => {
  value = value[0].toUpperCase() + value.substring(1, value.length);
  return value.replace(/([A-Z]+)/g, " $1").replace(/^ /, "");
};
