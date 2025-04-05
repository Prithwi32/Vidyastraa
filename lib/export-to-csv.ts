export function convertPaymentsToCSV(payments: any[]) {
  if (payments.length === 0) return "";

  const headers = Object.keys(payments[0]);
  const csvRows = payments.map((payment) =>
    headers.map((header) => `"${payment[header]}"`).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}
