// import { useDispatch, useSelector } from "../hooks/useCustomRedux";
// import { closeModal } from "../slices/modalSlice";
// import { clearCart } from "../slices/cartSlice";
import { useModalState, useModalActions } from "../hooks/useModalStore";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
  const isOpen = useModalState();
  const { closeModal } = useModalActions();
  const { clearCart } = useCartActions();

  // const { isOpen } = useSelector((state) => state.modal);
  // const dispatch = useDispatch();

  const handleClose = () => {
    // dispatch(closeModal());
    closeModal();
  };

  const handleConfirm = () => {
    // 장바구니 초기화
    // dispatch(clearCart());
    clearCart();
    // 모달 닫기
    // dispatch(closeModal());
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
          정말 삭제하시겠습니까?
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
