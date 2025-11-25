import { FaShoppingCart } from "react-icons/fa";
// import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";
// import { calculateTotals } from "../slices/cartSlice";
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const Navbar = () => {
  const { amount, cartItems } = useCartInfo();
  const { calculateTotals } = useCartActions();

  // const { amount, cartItems } = useSelector((state) => state.cart);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(calculateTotals());
  // }, [dispatch, cartItems]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals, cartItems]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => (window.location.href = "/")}
        className="text-2xl font-semibold cursor-pointer"
      >
        Ohthani Ahn
      </h1>
      <div className="flex items-center gap-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
