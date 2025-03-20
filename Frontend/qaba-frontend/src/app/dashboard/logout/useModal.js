// src/components/logout/useModal.js
import { useState, useEffect } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return { isOpen, openModal: () => setIsOpen(true), closeModal: () => setIsOpen(false) };
};

export default useModal;