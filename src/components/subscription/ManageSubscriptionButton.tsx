"use client";

import React, { useState, useTransition, FormEvent } from "react";
import { checkout } from "../../services/checkout";

interface ManageUserSubscriptionButtonProps {
  userId: string;
  email: string;
  stripePriceId: string;
  onClose: () => void;
}

const ManageUserSubscriptionButton: React.FC<ManageUserSubscriptionButtonProps> = ({
  userId,
  email,
  stripePriceId,
  onClose
}) => {
  const [isPending, startTransition] = useTransition();
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoader(true);
    startTransition(async () => {
      try {
        const data = {
          email,
          userId,
          stripePriceId,
        };
        const res = await checkout(data);

        if (res.success) {
          onClose()
        }
      } catch (err: any) {
        console.error(err.message);
        // toast({ description: "Something went wrong, please try again later." });
      } finally {
        setLoader(false);
      }
    });
  };

  return (
    <button
      onClick={handleSubmit}
      className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      disabled={isPending || loader || stripePriceId === ""}
    >
      {isPending ? "Processing..." : "Subscribe Now - $500/month"}
    </button>
  );
};

export default ManageUserSubscriptionButton;
