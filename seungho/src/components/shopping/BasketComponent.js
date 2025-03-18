import React, { useState } from "react";
import { ShoppingCart, Trash } from "lucide-react";
import SubMenuber from "../menu/SubMenubar";
import { useNavigate } from "react-router-dom";

const BasketComponent = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Nike Air Max",
      price: 129.99,
      quantity: 1,
      image: "/images/test1.png",
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 149.99,
      quantity: 1,
      image: "/images/test2.png",
    },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div>
      <SubMenuber />
      <div className=" mt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart size={32} /> 장바구니
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg">장바구니가 비어 있습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 장바구니 리스트 */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-300 rounded  hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-300 rounded  hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 ml-4"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* 장바구니 요약 */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">최종 결제 금액</h2>
              <p className="text-lg font-semibold mb-2">
                총 가격: ${totalPrice}
              </p>
              <button
                className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                onClick={() => navigate("/shopping/payment")}
              >
                결제하러가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketComponent;
