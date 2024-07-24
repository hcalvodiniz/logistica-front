import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'


export const MyModal = ({children, modalTitle, show, handleClose, size = 'md'}) => {
    
    return (
        <>
            <Modal show={show} onHide={handleClose} size={size}>
                <Modal.Header closeButton>
                    <Modal.Title>{ modalTitle }</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
            </Modal>
        </>
    )
}

export default MyModal