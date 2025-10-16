import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OrderDetailsModal from "../components/OrderDetails/OrderDetailsModal";
import "../styles/scrollbar.css";
import { GET } from "../api/httpMethods";
import URLS, { getRestaurantImageUrl } from "../api/urls";
import ORDER_STATUS, { STATUS_TABS } from "../constants/orderstatus";
import { PackageOpen, ShoppingBag } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(ORDER_STATUS.ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await GET(URLS.SHOW_ORDERS);
        if (Array.isArray(res.data.records)) {
          const mappedOrders = res.data.records.map((o) => {
            let status = o.status?.trim().toLowerCase();

            if (
              status === "canceled_by_user" ||
              status === "cancelled_by_user" ||
              status === "cancelled"
            ) {
              status = ORDER_STATUS.CANCELLED;
            } else if (status === "preparing" || status === "processing") {
              status = ORDER_STATUS.PROCESSING;
            } else if (status === "ready_to_deliver") {
              status = ORDER_STATUS.DISPATCHED;
            } else if (status === "accepted") {
              status = ORDER_STATUS.ACCEPTED;
            } else if (status === "pending") {
              status = ORDER_STATUS.PENDING;
            } else if (status === "delivered") {
              status = ORDER_STATUS.DELIVERED;
            } else {
              status = ORDER_STATUS.PENDING;
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
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];
    if (filterStatus !== ORDER_STATUS.ALL)
      filtered = filtered.filter((o) => o.status === filterStatus);
    if (fromDate)
      filtered = filtered.filter(
        (o) => new Date(o.created_at) >= new Date(fromDate)
      );
    if (toDate)
      filtered = filtered.filter(
        (o) => new Date(o.created_at) <= new Date(toDate)
      );
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
      o.id === orderId ? { ...o, status: ORDER_STATUS.CANCELLED } : o
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  const placeholderCount = 6;
  const renderItems =
    loading
      ? Array.from({ length: placeholderCount }).map((_, index) => ({
          placeholder: true,
          id: index,
        }))
      : filteredOrders.length > 0
      ? filteredOrders
      : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* Status Tabs */}
      <div className="sticky top-[70px] z-40 flex justify-center bg-gray-100 border-b border-gray-200 shadow-sm py-3">
        <div className="flex gap-3 overflow-x-auto px-4 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setFilterStatus(tab.name)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${
                  filterStatus === tab.name
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
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: placeholderCount }).map((_, index) => (
                <OrderPlaceholder key={index} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderItems.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  openOrderDetails={openOrderDetails}
                />
              ))}
            </div>
          )}
        </div>
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

// Placeholder card
function OrderPlaceholder() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse bg-white h-36 flex gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
}

// Actual order card
function OrderCard({ order, openOrderDetails }) {
  const finalTotal = Number(order.total_price) || 0;


  return (
    <div
      className="cursor-pointer border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white hover:bg-green-50 relative"
      onClick={() => openOrderDetails(order.id)}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={getRestaurantImageUrl(order.restaurant?.thumb)}
            alt={order.restaurant?.name}
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
              <p className="font-semibold text-green-600">Dhs {finalTotal}</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
          order.status === ORDER_STATUS.DELIVERED
            ? "bg-green-100 text-green-700"
            : order.status === ORDER_STATUS.PENDING
            ? "bg-yellow-100 text-yellow-700"
            : order.status === ORDER_STATUS.CANCELLED
            ? "bg-red-100 text-red-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </span>
    </div>
  );
}

// 🩵 Empty state when no orders
function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
        <PackageOpen size={40} />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">No Orders Yet</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-sm">
        It looks like you haven’t placed any orders yet. Start exploring
        restaurants and enjoy your first meal!
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
      >
        <ShoppingBag size={16} /> Order Now
      </button>
    </div>
  );
}
