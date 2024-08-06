import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className="bg-white p-6 shadow-lg w-full max-w-xl max-h-screen overflow-y-auto">
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
