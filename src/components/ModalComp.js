import React from 'react'
import { Modal, ModalActions, ModalDescription, Header, Image, Button, ModalHeader } from 'semantic-ui-react'

const ModalComp = ({open, setOpen, img, name, emprego, 
sobrenome, endereco, id, handleDelete}) => {

  return (
    <Modal onClose={() => setOpen(false)} 
    onOpen={() => setOpen(true)} 
    open={open}
    >
        <ModalHeader>Detalhe do usuário</ModalHeader>
        <Modal.Content image>
            <Image size="medium" src={img} wrapped />
            <ModalDescription>
                <Header>{name}</Header>
                <p>{sobrenome}</p>
                <p>{emprego}</p>
                <p>{endereco}</p>
            </ModalDescription>
        </Modal.Content>
        <ModalActions>
        <Button color="black" onClick={() => 
        setOpen(false)}>
        Cancel
        </Button>
        <Button color="red" Content="Delete"
        labelPosition="right" 
        icon="checkmark"
        onClick={() => 
        handleDelete(id)}>
            Delete
        </Button>
        </ModalActions>
    </Modal>
  )

}

export default ModalComp