import BaseModal from "./BaseModal";

export default function TermsModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Terms & Policies" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          By using Bannugul, you agree to the following terms and policies that ensure a
          safe and reliable experience for all our users:
        </p>

        <ul className="list-decimal list-inside space-y-2">
          <li>
            Your personal data is collected and processed in accordance with our{" "}
            <b>Privacy Policy</b>.
          </li>
          <li>
            Orders that have been confirmed cannot be cancelled or refunded, except in
            specific eligible cases.
          </li>
          <li>
            Bannugul reserves the right to update, modify, or revise these terms at any
            time without prior notice.
          </li>
        </ul>

        <p className="text-gray-600">
          If you have any questions or concerns, please reach out to us at{" "}
          <a
            href="mailto:support@bannugul.com"
            className="text-green-600 font-medium hover:underline"
          >
            support@bannugul.com
          </a>.
        </p>

        <p className="text-sm text-gray-500 border-t pt-2">
          Last updated: <b>October 2025</b>
        </p>
      </div>
    </BaseModal>
  );
}
