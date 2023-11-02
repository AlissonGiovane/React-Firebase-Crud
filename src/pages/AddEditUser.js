import React, {useState, useEffect} from 'react'
import {Button,  Form, Grid, Loader, Container, GridColumn} from 'semantic-ui-react';
import { storage, db } from '../firebase';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';

const initialState = {
  nome: "",
  sobrenome: "",
  emprego: "",
  endereco: "",
  telefone: "",
  email: "",
  nacionalide: "",
  datadenascimento: ""
}

  const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const {nome, sobrenome, emprego, endereco, telefone, email, nacionalide, datadenascimento} = data
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navegitate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
      id && getSingleUser();
    }, [id])

    const getSingleUser = async () => {
      const docRef = doc(db, "users", id);
      const snapshot = await getDoc(docRef); 
      if(snapshot.exists()) {
        setData({...snapshot.data()});
      }
    }

    useEffect(() => {
      const uploadFile = () =>{
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        uploadTask.on
        ("state_changed", 
        (snapshot) => {
          const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
            switch (snapshot.state){
            case "paused":
            console.log("upload is Paused");
            break;
            case "Running":
              console.log("upload is running");
              break;
            default:
              break;
          }
        }, 
        (error) =>{
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then 
          ((downloadURL) => {
            setData((prev) => ({...prev, img: downloadURL}));
        });
      }
    );
  };

    file && uploadFile()
}, [file]);

    const handleChange = (e) => {
      setData({...data, [e.target.name]: e.target.value});
    }

    const validate = () => {
      let errors = {};
      if (!nome){
        errors.nome = "Nome inválido";
      }
      if (!sobrenome){
        errors.sobrenome = "sobrenome inválido";
      }
      if (!emprego){
        errors.emprego = "emprego inválido";
      }
      if (!endereco){
        errors.endereco = "Endereço inválido";
      }
      if (!telefone){
        errors.telefone = "Telefone inválido";
      }
      if (!email){
        errors.email = "Email inválido";
      }
      if (!nacionalide){
        errors.nacionalide = "Nacionalidade inválida";
      }
      if (!datadenascimento){
        errors.datadenascimento = "Data de Nascimento inválida";
      }

      return errors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      let errors = validate()
      if (Object.keys(errors).length) return setErrors(errors);
      setIsSubmit(true);
      if(!id){
        try{
          await addDoc(collection(db, "users"),{
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch(error) {
          console.log(error);
        }
      }else{
        try{
          await updateDoc(doc(db, "users", id),{
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch(error) {
          console.log(error);
        }
      }

      Navigate("/")
    };

    return (
        <Grid 
        centered 
        verticalAlign='middle' 
        columns="3" 
        style={{height: "80vh"}}
        >
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <div>
              {isSubmit ?  (
              <Loader active inline="centered" 
              size="huge" /> ) : (
              <>
              <h2>{id ? "Atualizar Usuário": "Adicionar Usuário"}</h2>
              <Form onSubmit={handleSubmit}>
                <Container></Container>
                <Form.Input
                label="Nome" 
                error={errors.nome ? {content: errors.nome} : null}
                placeHolder="Digite seu nome" 
                name="nome" 
                onChange={handleChange}
                value={nome}
                autoFocus
                />
                <Form.Input
                label="Sobrenome" 
                error={errors.sobrenome ? {content: errors.sobrenome} : null}
                placeHolder="Digite seu sobrenome" 
                name="sobrenome" 
                onChange={handleChange}
                value={sobrenome}
                />
                <Form.Input
                label="Emprego" 
                error={errors.emprego ? {content: errors.emprego} : null}
                name="emprego" 
                placeHolder="Digite seu emprego"
                onChange={handleChange}
                value={emprego}
                />
                <Form.Input
                label="Endereço" 
                error={errors.endereco ? {content: errors.endereco} : null}
                placeHolder="Digite seu endereço" 
                name="endereco" 
                onChange={handleChange}
                value={endereco}
                />
                <Form.Input
                type='number'
                label="Telefone" 
                error={errors.telefone ? {content: errors.telefone} : null}
                placeHolder="Digite seu telefone" 
                name="telefone" 
                onChange={handleChange}
                value={telefone}
                />
                <Form.Input
                type='email'
                label="Email" 
                error={errors.email ? {content: errors.email} : null}
                placeHolder="Digite seu email" 
                name="email" 
                onChange={handleChange}
                value={email}
                />
                <Form.Input
                label="Nacionalidade" 
                error={errors.nacionalide ? {content: errors.nacionalide} : null}
                placeHolder="Digite sua Nacionalidade" 
                name="nacionalide" 
                onChange={handleChange}
                value={nacionalide}
                />
                <Form.Input
                type="date"
                label="Data de nascimento" 
                error={errors.datadenascimento ? {content: errors.datadenascimento} : null}
                placeHolder="Digite sua Data de nascimento" 
                name="datadenascimento" 
                onChange={handleChange}
                value={datadenascimento}
                />
                <Form.Input
                label="Upload" 
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                />
                <Button primary type="submit" 
                disabled={progress !== null && progress < 100}>
                    Enviar
                </Button>
              </Form>
              </>  
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
        </Grid>
    );
};

export default AddEditUser