import BaseModal from "./BaseModal";

export default function PaymentModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Payment Methods" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Bannugul makes payments easy and secure — choose the option that suits you best:
        </p>

        <ul className="space-y-2">
          <li>💵 <b>Cash on Delivery</b> — pay conveniently at your doorstep.</li>
          <li>💳 <b>Credit/Debit Cards</b> — we accept Visa and MasterCard.</li>
          <li>🏦 <b>Bank Transfer</b> — for business or bulk orders.</li>
        </ul>

        <p>
          For any payment-related issues or assistance, please contact us at{" "}
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
