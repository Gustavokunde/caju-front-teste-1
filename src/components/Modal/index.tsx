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
const ModalButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  background-color: #007c89;
  color: white;
  &:hover {
    background-color: #005f6a;
  }
`;

const CancelButton = styled(ModalButton)`
  background-color: #ccc;
  &:hover {
    background-color: #aaa;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string | null;
  onConfirm?: () => void;
}

const Modal = ({ isOpen, onClose, message, onConfirm }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay data-testid="modal">
      <ModalContent>
        <p>{message}</p>
        {onConfirm && <ModalButton onClick={onConfirm}>Confirmar</ModalButton>}
        <CancelButton onClick={onClose}>Fechar</CancelButton>
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
