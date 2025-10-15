import BaseModal from "./BaseModal";

export default function HelpCenterModal({ isOpen, onClose }) {
  return (
    <BaseModal title="Help Center" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Need assistance? Our friendly support team is available <b>24/7</b> to
          help you with orders, accounts, or app-related questions.
        </p>

        <ul className="space-y-2">
          <li>
            📧 Email us:&nbsp;
            <a
              href="mailto:support@bannugul.com"
              className="text-green-600 font-medium hover:underline"
            >
              support@bannugul.com
            </a>
          </li>
          <li>📞 Call: <span className="font-medium text-gray-800">+92 300 1234567</span></li>
          <li>💬 Live Chat: Available directly in the app</li>
        </ul>

        <p>
          Our goal is to ensure every Bannugul user has a smooth, enjoyable food
          ordering experience. Don’t hesitate to reach out — we’re here to help!
        </p>
      </div>
    </BaseModal>
  );
}
