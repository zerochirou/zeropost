export function formatRelativeTime(dateString: string): string {
  const normalizedString = dateString.replace(" ", "T");
  const targetDate = new Date(normalizedString);
  const now = new Date();

  // Validasi apakah tanggal valid
  if (isNaN(targetDate.getTime())) {
    return "Waktu tidak valid";
  }

  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000,
  );

  if (diffInSeconds < 5) {
    return "Baru saja";
  }

  const intervals: { label: string; seconds: number }[] = [
    { label: "tahun", seconds: 31536000 },
    { label: "bulan", seconds: 2592000 },
    { label: "minggu", seconds: 604800 },
    { label: "hari", seconds: 86400 },
    { label: "jam", seconds: 3600 },
    { label: "menit", seconds: 60 },
    { label: "detik", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label} yang lalu`;
    }
  }

  return "Baru saja";
}
