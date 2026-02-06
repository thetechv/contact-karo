// Utility functions

export function formatDate(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  // Format 10 digit phone as XXX-XXX-XXXX
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
}

export function validateVehicleNo(vehicleNo: string): boolean {
  // Basic validation for Indian vehicle numbers
  return vehicleNo.trim().length >= 4;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
    case "unassigned":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "disabled":
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    case "created":
    case "generating":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
    case "in-printing":
      return "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400";
    case "distributed":
      return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
