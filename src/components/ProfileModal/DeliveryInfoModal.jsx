import BaseModal from "./BaseModal";

export default function DeliveryInfoModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Delivery Information" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Bannugul ensures fast and reliable deliveries to make your experience seamless.
          Here’s everything you need to know about our delivery process:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            🚚 <b>Delivery Areas:</b> We currently deliver within all major cities and
            surrounding areas.
          </li>
          <li>
            ⏰ <b>Delivery Time:</b> Average delivery time is between <b>30–45 minutes</b>,
            depending on location and restaurant preparation.
          </li>
          <li>
            💵 <b>Delivery Charges:</b> Calculated based on distance and shown before
            order confirmation.
          </li>
          <li>
            📦 <b>Tracking:</b> You can track your order status live within the app.
          </li>
        </ul>

        <p>
          For delivery issues or questions, please contact our support team at{" "}
          <a
            href="mailto:support@bannugul.com"
            className="text-green-600 font-medium hover:underline"
          >
            support@bannugul.com
          </a>.
        </p>
      </div>
    </BaseModal>
  );
}

