import React, {useEffect, useState} from 'react';
import { Button, Container, CardGroup, Card, CardContent, Grid, GridColumn, Image, CardHeader, CardDescription } from 'semantic-ui-react';
import {db} from "../firebase";
import {useNavigate} from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { list } from 'firebase/storage';
import ModalComp from '../components/ModalComp';
import Spinner from '../components/Spinner';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';

const Home = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
  setLoading(true);
  const unsub = onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUsers(list);
      setLoading(false);
      },
      (error) => {
        console.log(error);
      }
  );

  return () => {
    unsub();
  };
}, []);

if (loading) {
  return <Spinner />;
}

const handleModal = (item) => {
  setOpen(true)
  setUser(item)
};

const handleDelete = async (id) => {
  if(window.confirm("Tem certeza que deseja deletar esse usuário?")){
    try{
      setOpen(false);
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error){
      console.log(error)
    }
  }
};

return (
  <Container>
          <Navbar />
      <Grid columns={3} stackable>
        {users && 
        users.map((item) => (
          <GridColumn key={item.id}>
            <Card>
              <CardContent>
                <CardHeader style={{ marginTop: "10px"}}>
                  {item.name}
                </CardHeader>
                <CardDescription>
                  {item.sobrenome}
                </CardDescription>
              </CardContent>
              <CardContent>
                <Card.Content extra>
                  <div>
                    <Button
                    color="green"
                    onClick={() => 
                      navigate(`/update/${item.id}`)}
                    >
                      Atualizar
                    </Button>
                    <Button color="purple" onClick={() => handleModal(item)}>
                      Ver
                    </Button>
                    {open && (
                      <ModalComp
                      open={open}
                      setOpen={setOpen}
                      handleDelete={handleDelete}
                      {...user}
                      />
                    )}
                  </div>
                </Card.Content>
              </CardContent>
            </Card>
          </GridColumn>
        ))}
      </Grid>
  </Container>
);
};

export default Home