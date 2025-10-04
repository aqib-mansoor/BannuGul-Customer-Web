// src/constants/orderStatus.js
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  CubeIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ORDER_STATUS = {
  ALL: "all",
  PENDING: "pending",
  ACCEPTED: "accepted",
  PROCESSING: "processing",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Tabs for UI (Orders Page)
export const STATUS_TABS = [
  { name: ORDER_STATUS.ALL, label: "All", icon: TruckIcon },
  { name: ORDER_STATUS.PENDING, label: "Pending", icon: ClockIcon },
  { name: ORDER_STATUS.ACCEPTED, label: "Accepted", icon: CheckCircleIcon },
  { name: ORDER_STATUS.PROCESSING, label: "Processing", icon: CubeIcon },
  { name: ORDER_STATUS.DISPATCHED, label: "Dispatched", icon: ArrowPathIcon },
  { name: ORDER_STATUS.DELIVERED, label: "Delivered", icon: CheckCircleIcon },
  { name: ORDER_STATUS.CANCELLED, label: "Cancelled", icon: XCircleIcon },
];

// Stepper for OrderDetailsModal
export const STATUS_STEPS = [
  { name: ORDER_STATUS.PENDING, label: "Pending" },
  { name: ORDER_STATUS.ACCEPTED, label: "Accepted" },
  { name: ORDER_STATUS.PROCESSING, label: "Processing" },
  { name: ORDER_STATUS.DISPATCHED, label: "Dispatched" },
  { name: ORDER_STATUS.DELIVERED, label: "Delivered" },
];

// Normalizer: maps backend status → ORDER_STATUS
export const normalizeStatus = (status) => {
  if (!status) return null;

  const lower = status.toLowerCase();

  if (lower === "canceled_by_user" || lower === "cancelled_by_user") {
    return ORDER_STATUS.CANCELLED;
  }
  if (lower === "preparing" || lower === "processing") {
    return ORDER_STATUS.PROCESSING;
  }
  if (lower === "ready_to_deliver") {
    return ORDER_STATUS.DISPATCHED;
  }
  if (lower === "pending") {
    return ORDER_STATUS.PENDING;
  }
  if (lower === "accepted") {
    return ORDER_STATUS.ACCEPTED;
  }
  if (lower === "delivered") {
    return ORDER_STATUS.DELIVERED;
  }

  return lower; // fallback
};

export default ORDER_STATUS;
