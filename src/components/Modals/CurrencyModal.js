import { Modal, Button } from 'react-bootstrap';

function CurrencyModal({ show, onClose, onSubmit }) {
  return (
    <Modal show={show} size='sm' onHide={onClose}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Moneda</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button className='w-100 mb-3' onClick={() => onSubmit('USD')}>
          USD
        </Button>
        <Button className='w-100' onClick={() => onSubmit('Bs')}>
          Bs
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default CurrencyModal;
