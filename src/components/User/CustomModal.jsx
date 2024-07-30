import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
        >
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
