import BaseModal from "./BaseModal";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Privacy Policy" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          At <b>Bannugul</b>, we value your privacy and are committed to protecting your
          personal information. This policy outlines how we collect, use, and safeguard
          your data.
        </p>

        <ul className="list-decimal list-inside space-y-2">
          <li>
            We collect only necessary information such as name, contact number, and
            delivery address to complete your orders.
          </li>
          <li>
            Your data is stored securely and never shared with third parties except for
            order fulfillment purposes.
          </li>
          <li>
            You can request data removal or updates anytime by contacting our support
            team.
          </li>
        </ul>

        <p>
          For any questions about our privacy policy, reach out at{" "}
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
