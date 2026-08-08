import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { getUserData } from "../Redux/Slices/AuthSlice";
import {
  buySubscription,
  cancelSubscription,
  getRazorpayKey,
  verifyPayment,
} from "../Redux/Slices/PaymentSlice";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.data);
  const subscriptionStatus = user?.subscription?.status;

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  async function handleSubscribe() {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      return;
    }

    const keyRes = await dispatch(getRazorpayKey());
    const key = keyRes?.payload?.key;

    const subRes = await dispatch(buySubscription());
    const subscriptionId = subRes?.payload?.subscriptionId;

    if (!key || !subscriptionId) {
      return;
    }

    const options = {
      key,
      subscription_id: subscriptionId,
      name: "LMS Subscription",
      description: "Get access to all courses",
      handler: async function (response) {
        const verifyRes = await dispatch(
          verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          })
        );
        if (verifyRes?.payload?.success) {
          dispatch(getUserData());
          navigate("/checkout/success");
        } else {
          navigate("/checkout/fail");
        }
      },
      theme: {
        color: "#3b82f6",
      },
    };

    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  }

  async function handleCancel() {
    const res = await dispatch(cancelSubscription());
    if (res?.payload?.success) {
      dispatch(getUserData());
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="card bg-base-200 text-white w-96 shadow-xl">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-2xl">Premium Subscription</h1>
            <p className="text-gray-300">
              Get unlimited access to all courses and lectures on the platform.
            </p>

            <p className="mt-2">
              Current Status:{" "}
              <span className="badge badge-primary">
                {subscriptionStatus === "active" ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="card-actions mt-4">
              {subscriptionStatus === "active" ? (
                <button onClick={handleCancel} className="btn btn-error">
                  Cancel Subscription
                </button>
              ) : (
                <button onClick={handleSubscribe} className="btn btn-primary">
                  Subscribe Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Checkout;
