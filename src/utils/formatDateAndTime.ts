export const formatDate = (date: string): string => {
  if (!date) return "";

  date = new Date(date).toString();
  let options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};
