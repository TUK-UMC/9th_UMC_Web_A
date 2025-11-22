import { useDispatch } from "../hooks/useCustomRedux";
import { decrease, increase, removeItem } from "../slices/cartSlice";
import type { Lp } from "../types/cart";

interface CartItemProps {
  lp: Lp;
}

const CartItem = ({ lp }: CartItemProps) => {
  const dispatch = useDispatch();

  const handleIncreaseCount = () => {
    dispatch(increase({ id: lp.id }));
  };

  const handleDecreaseCount = () => {
    if (lp.amount === 1) {
      dispatch(removeItem({ id: lp.id }));
      return;
    }

    dispatch(decrease({ id: lp.id }));
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <img
        src={lp.img}
        alt={`${lp.title}의 LP 이미지`}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{lp.title}</h3>
        <p className="text-sm text-gray-600">{lp.singer}</p>
        <p className="text-sm font-bold text-gray-600">{lp.price} 원</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDecreaseCount}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer"
        >
          -
        </button>
        <span className="px-4 py-[3px] border-y border-gray-300">
          {lp.amount}
        </span>
        <button
          onClick={handleIncreaseCount}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
