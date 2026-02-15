/**
 * Форматирование даты в читаемый формат
 * @param dateString - строка с датой
 * @param options - опции форматирования
 * @returns отформатированная дата
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string => {
  if (!dateString || dateString === "N/A") return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  } catch {
    return dateString;
  }
};

/**
 * Конвертирует минуты в формат часов и минут
 * @param minutes - количество минут
 * @returns отформатированная строка (например, "2h 30m")
 */
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Определяет цвет рейтинга на основе значения
 * @param rating - рейтинг (0-10)
 * @returns HEX цвет для отображения
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 7) return "#21d07a"; // зелёный
  if (rating >= 5) return "#d2d531"; // жёлтый
  return "#db2360"; // красный
};

/**
 * Закругляет рейтинг до одного знака после запятой
 * @param rating - рейтинг
 * @returns закруглённый рейтинг
 */
export const formatRating = (rating: number): number => {
  return Math.round((rating || 0) * 10) / 10;
};
