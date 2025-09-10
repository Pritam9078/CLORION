import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getEcosystemColor(type: string): string {
  const colors = {
    MANGROVE: "text-green-600 bg-green-50",
    SEAGRASS: "text-blue-600 bg-blue-50",
    WETLAND: "text-purple-600 bg-purple-50",
    SALT_MARSH: "text-orange-600 bg-orange-50",
  };
  return colors[type as keyof typeof colors] || "text-gray-600 bg-gray-50";
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function getStatusColor(status: string): string {
  const colors = {
    DRAFT: "text-gray-600 bg-gray-50",
    SUBMITTED: "text-blue-600 bg-blue-50",
    UNDER_REVIEW: "text-yellow-600 bg-yellow-50",
    VERIFIED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
    ACTIVE: "text-emerald-600 bg-emerald-50",
    COMPLETED: "text-purple-600 bg-purple-50",
    PENDING: "text-orange-600 bg-orange-50",
    APPROVED: "text-green-600 bg-green-50",
  };
  return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-50";
}
