export default {
  id: { type: "Number", readonly: true, primaryKey: true },
  description: { type: "String", indexed: true },
  category: { type: "Dropdown", indexed: true },
  date: { type: "Date", indexed: true },
  value: { type: "Money", indexed: true },
};
