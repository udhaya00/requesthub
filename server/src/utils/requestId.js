const randomSegment = () => Math.random().toString(36).slice(2, 6).toUpperCase();

export const generateRequestId = () => {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  return `SRH-${stamp}-${randomSegment()}`;
};
