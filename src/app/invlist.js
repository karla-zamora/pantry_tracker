// Inventory list object

'use client';
import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { Box, Stack, Typography, Button, Modal, TextField, borders, IconButton, Divider } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}


export default function InvList({ listName }) {
  //State variables:
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  //Functions:
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, listName))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      if (doc.id != 'placeholder') {
        inventoryList.push({ name: doc.id, ...doc.data() })
      }
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    console.log("inventory changed")
  }, [inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, listName), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, listName), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  //********************************************************************* */
  return (
    <Box
      id="stack-item"
      width="100%"
      height="100%"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ borderRadius: '15px' }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        id="list"
        border={'1px solid #6096ba'}
        width={{ xs: "80%", sm: "25vw" }}
        sx={{ borderRadius: '15px', backgroundColor: "#e7ecef" }}

        height='25vh'
      >
          <Box
            id='bluebox'
            width="100%"
            height="20%"
            bgcolor={'#6096ba'}

            justifyContent={'center'}
            alignItems={'center'}
            sx={{ borderRadius: '15px' }}
          >
            <Stack
              id="bluebox-stack"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem variant="middle" />}
              sx={{ width: '100%' , mb:'3' }}
            >
              <Box
                component="div"
                sx={{
                  flexGrow: 1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  alignItems: 'center'
                }}
              >
                <Typography
                  id="text"
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' , p:'2' }}
                  variant="h4"
                  color="white"
                  textAlign={'center'}
                >
                  {listName}
                </Typography>
              </Box>
              <IconButton onClick={handleOpen} sx={{ ml: 2 }}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Stack>

          </Box>

        <Stack width="100%" height="72%" spacing={1} overflow={'auto'}>
          {inventory.length != 0 ? inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="25%"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >

              <Typography variant={'p'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" sx={{backgroundColor:"#a3cef1"}} onClick={() =>
                removeItem(name)
              }>
                Remove
              </Button>
            </Box>
          )) : <Box alignSelf={'center'}>Empty list</Box>}
        </Stack>
      </Box>

    </Box>
  );
}

