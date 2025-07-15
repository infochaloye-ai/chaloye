import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const { cart, removeFromCart, clearCart } = useAuth();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/60 p-0 overflow-hidden animate-modalIn">
        {/* Close Button */}
        <button
          aria-label="Close cart"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/70 hover:bg-gray-100 border border-gray-200 rounded-full p-2 shadow-sm transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Your Cart</h2>
          <p className="text-gray-500 text-sm">Review your selected adventures</p>
        </div>
        {/* Cart Items */}
        <div className="max-h-72 overflow-y-auto px-8 pb-2">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map(item => (
                <li key={item.id} className="flex items-center py-5 gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-base line-clamp-1">{item.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{item.location} &bull; {item.duration}</div>
                    <div className="text-gray-700 text-sm mt-1">${item.price} <span className="text-gray-400">x</span> {item.quantity}</div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 bg-gray-100 hover:bg-red-50 text-red-500 rounded-full p-2 transition-colors"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Divider */}
        <div className="px-8 pt-2">
          <div className="border-t border-gray-200" />
        </div>
        {/* Total & Actions */}
        <div className="px-8 py-6 bg-white/70 backdrop-blur-lg rounded-b-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-gray-900">Total</div>
            <div className="text-2xl font-extrabold text-green-600">${total}</div>
          </div>
          <div className="flex justify-between gap-2">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Cart
            </button>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-colors"
              disabled
            >
              Checkout (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal; 