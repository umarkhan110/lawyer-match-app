import { useAuthStore } from "@/store/useAuthStore";
import ManageUserSubscriptionButton from "./ManageSubscriptionButton"
interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const stripePriceId= process.env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCT || ""

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
    const { user } = useAuthStore();
  console.log(isOpen)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-scroll">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button> */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Premium Lawyer Portal</h2>
          <p className="text-gray-600">
            Get access to our premium features for $500/month
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Premium Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="bg-blue-100 p-1 rounded-full mr-3">✓</span>
                Real-time client matching
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 p-1 rounded-full mr-3">✓</span>
                Interactive map integration
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 p-1 rounded-full mr-3">✓</span>
                Client notifications
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 p-1 rounded-full mr-3">✓</span>
                Advanced scheduling system
              </li>
            </ul>
          </div>
          {user && user?.id && user?.email &&
          <ManageUserSubscriptionButton
                  userId={user?.id}
                  email={user?.email}
                  stripePriceId={stripePriceId}
                  onClose={onClose}
                />}
          <p className="text-sm text-gray-500 text-center">
            You can cancel your subscription at any time
          </p>
        </div>
      </div>
    </div>
  );
};