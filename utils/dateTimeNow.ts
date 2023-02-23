export const dateTimeNow = () => {
  const date = new Date();
  const offset = date.getTime() - date.getTimezoneOffset() * 60000;
  return new Date(offset).toISOString();
};
