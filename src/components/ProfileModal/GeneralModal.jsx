import BaseModal from "./BaseModal";

export default function GeneralModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Business Information" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3 text-gray-700 leading-relaxed">
        <p>
          Bannugul connects food lovers with a wide range of local restaurants and
          vendors, bringing convenience and variety right to your fingertips.
        </p>
        <p>
          Our platform enables seamless food delivery, takeaway, and table
          reservation experiences — designed to support both customers and
          restaurant partners.
        </p>
        <p>
          Interested in growing your business with us? Reach out to our partnership
          team anytime at{" "}
          <a
            href="mailto:support@bannugul.com"
            className="text-green-600 font-medium hover:underline"
          >
            support@bannugul.com
          </a>
          .
        </p>
      </div>
    </BaseModal>
  );
}
