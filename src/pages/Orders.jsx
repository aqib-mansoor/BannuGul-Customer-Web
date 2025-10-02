// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  CubeIcon,
  ArrowPathIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OrderDetailsModal from "../components/OrderDetails/OrderDetailsModal";
import "../styles/scrollbar.css";
import { GET } from "../api/httpMethods";
import URLS from "../api/urls";


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const statusTabs = [
    { name: "all", label: "All", icon: TruckIcon },
    { name: "pending", label: "Pending", icon: ClockIcon },
    { name: "accepted", label: "Accepted", icon: CheckCircleIcon },
    { name: "processing", label: "Processing", icon: CubeIcon },
    { name: "dispatched", label: "Dispatched", icon: ArrowPathIcon },
    { name: "delivered", label: "Delivered", icon: CheckCircleIcon },
    { name: "cancelled", label: "Cancelled", icon: XCircleIcon },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await GET(URLS.SHOW_ORDERS);
        if (Array.isArray(res.data.records)) {
          const mappedOrders = res.data.records.map((o) => {
            let status = o.status?.trim().toLowerCase();

            // Normalize backend statuses
            if (status === "canceled_by_user" || status === "cancelled_by_user" || status === "cancelled") {
              status = "cancelled";
            } else if (status === "preparing" || status === "processing") {
              status = "processing";
            } else if (status === "ready_to_deliver") {
              status = "dispatched";
            } else if (status === "accepted") {
              status = "accepted";
            } else if (status === "pending") {
              status = "pending";
            } else if (status === "delivered") {   // ✅ lowercase
              status = "delivered";
            } else {
              status = "pending"; // fallback
            }


            return { ...o, status };
          });

          setOrders(mappedOrders);
          setFilteredOrders(mappedOrders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];
    if (filterStatus !== "all")
      filtered = filtered.filter((o) => o.status === filterStatus);
    if (fromDate)
      filtered = filtered.filter((o) => new Date(o.created_at) >= new Date(fromDate));
    if (toDate)
      filtered = filtered.filter((o) => new Date(o.created_at) <= new Date(toDate));
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.restaurant?.name.toLowerCase().includes(query) ||
          o.id.toString().includes(query)
      );
    }
    setFilteredOrders(filtered);
  }, [filterStatus, fromDate, toDate, searchQuery, orders]);

  const openOrderDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const res = await GET(`${URLS.SHOW_ORDER_DETAILS}?order_id=${id}`, {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      });

      if (res.data) setSelectedOrder(res.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "cancelled" } : o
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Status Tabs */}
      <div className="sticky top-[70px] z-40 flex justify-center bg-gray-100 border-b border-gray-200 shadow-sm py-3">
        <div className="flex gap-3 overflow-x-auto px-4 scrollbar-none">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setFilterStatus(tab.name)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${filterStatus === tab.name
                  ? "bg-gradient-to-r from-green-500 to-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <main className="flex-1 px-2 md:px-4 py-6">
        {loading ? (
          <p className="text-center mt-10 text-green-600">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No orders found</p>
            <p className="text-gray-400 text-sm">Try changing the filters above</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
            {filteredOrders.map((order) => {
              const itemsTotal = Number(order.total_price) || 0;
              const deliveryCharge = Number(order.delivery_charges) || 0;
              const finalTotal = itemsTotal + deliveryCharge;

              return (
                <div
                  key={order.id}
                  className="cursor-pointer border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white hover:bg-green-50 relative"
                  onClick={() => openOrderDetails(order.id)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={order.restaurant?.thumb || ""}
                        alt={order.restaurant?.name || "Restaurant"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                          {order.restaurant?.name || "Restaurant"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ordered on:{" "}
                          {order.date_time
                            ? new Date(order.date_time).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-semibold text-green-600">
                            Dhs {finalTotal}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline">
                          <EyeIcon className="w-4 h-4" />
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          selectedOrder={selectedOrder}
          closeModal={closeModal}
          detailsLoading={detailsLoading}
          onCancel={handleCancelOrder}
        />
      )}

      <Footer />
    </div>
  );
}
