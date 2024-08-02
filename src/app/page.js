'use client';
import InvList from "./invlist";
import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { Box, Stack, Typography, Button, Modal, TextField, Container, Item, ImageList } from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


export default function Home() {
  //State variables:
  const [collections, setCollection] = useState([])
  const [open, setOpen] = useState(false)
  const [listName, setListName] = useState('')

  //**Functions:

  //Updates the list of collections (lists) as user creates new ones
  const updateCollections = async () => {
    const snapshot = query(collection(firestore, 'listOfCollections'))
    const cols = await getDocs(snapshot)
    const collectionList = []
    cols.forEach((doc) => {
      collectionList.push({ name: doc.id })
    })
    setCollection(collectionList) //set state with all collections
  }

  useEffect(() => {
    updateCollections();
    console.log("collection updated")
  }, [])

  const addCollection = async (name) => {
    //save the new collection into the list of collections
    await setDoc(doc(firestore, "listOfCollections", name), {});
    //save the collection into the actual database
    await setDoc(doc(firestore, name, 'placeholder'), { quantity: 1 });
    await updateCollections()
  }

  //To remove collection, retrieve all items and delete them
  const removeCollection = async (listName) => {
    const collectionRef = query(collection(firestore, listName))
    const collItems = await getDocs(collectionRef)
    //delete all items from collection
    for (const listItem of collItems.docs) {
      try {
        await deleteDoc(doc(firestore, listName, listItem.id));
      } catch (e) {
        console.log(e);
      }
    }
    //delete collection name from listOfCollections
    await deleteDoc(doc(firestore, "listOfCollections", listName))
    await updateCollections()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  //************************************************************************ */
  return (
    <Box
      id="whole-page"
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {collections.length > 3 ?
        <ImageList sx={{ margin: 'auto' }} variant="quilted" cols={3} gap={8}>
          {collections.map((list) => (<InvList key={list.name} listName={list.name} />))}
        </ImageList>
        :
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          {collections.map((list) => (<InvList key={list.name} listName={list.name} />))}
        </Stack>
      }



      <Stack id="input-form" width="50%" direction={'row'} spacing={2}>
        <TextField
          id="outlined-basic"
          label="List name"
          variant="outlined"
          fullWidth
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={async () => {
            await addCollection(listName)
            setListName('')
          }}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          onClick={async () => {
            await removeCollection(listName)
            setListName('')
          }}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  );
}

