import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string | null;
}

const Modal = ({ isOpen, onClose, message }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay data-testid="modal">
      <ModalContent>
        <p>{message}</p>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
