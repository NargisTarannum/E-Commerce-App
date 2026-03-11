"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../store/cartSlice";
import Navbar from "../../components/Navbar";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "My Shop",
      order_id: order.id,

      handler: async function (response) {
        await fetch("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            items,
            total,
            paymentId: response.razorpay_payment_id,
          }),
        });

        alert("Payment Successful!");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Cart</h1>

        {items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row justify-between items-center border p-4 rounded"
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="mt-2 md:mt-0 bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold mt-6">Total: ₹{total}</h2>

            <button
              onClick={() => dispatch(clearCart())}
              className="mt-4 bg-gray-800 text-white px-6 py-2 rounded"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="mt-4 ml-2 bg-green-600 text-white px-6 py-2 rounded"
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
