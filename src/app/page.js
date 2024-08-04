'use client';

import InvList from "./invlist";
import SideDrawer from "./sidedrawer.js"
import { useState, useEffect, useRef } from "react";
import { firestore } from "./firebase";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack, TextField, Button, ImageList, useMediaQuery, AppBar, Container, Toolbar } from "@mui/material";
import { collection, getDocs, query, setDoc, deleteDoc, doc } from 'firebase/firestore';

const theme = createTheme();

export default function Home() {
  // State variables:
  const [collections, setCollection] = useState([]);
  const [listName, setListName] = useState(''); // List to be added
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isClient, setIsClient] = useState(false); // State to check if the component is client-side
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // To set breakpoints for smaller screens aka converts grid into stack
  const listRefs = useRef({}); // Reference for lists

  // Updates the list of collections (lists) as user creates new ones
  const updateCollections = async () => {
    const snapshot = query(collection(firestore, 'listOfCollections'));
    const cols = await getDocs(snapshot);
    const collectionList = [];
    cols.forEach((doc) => {
      collectionList.push({ name: doc.id });
    });
    setCollection(collectionList); // set state with all collections
  };

  useEffect(() => {
    updateCollections();
    console.log("collection updated");
    setIsClient(true); // Set the client-side state to true
  }, []);

  const addCollection = async (name) => {
    // Save the new collection into the list of collections
    await setDoc(doc(firestore, "listOfCollections", name), {});
    // Save the collection into the actual database
    await setDoc(doc(firestore, name, 'placeholder'), { quantity: 1 });
    await updateCollections();
  };

  // To remove collection, retrieve all items and delete them
  const removeCollection = async (listName) => {
    const collectionRef = query(collection(firestore, listName));
    const collItems = await getDocs(collectionRef);
    // Delete all items from collection
    for (const listItem of collItems.docs) {
      try {
        await deleteDoc(doc(firestore, listName, listItem.id));
      } catch (e) {
        console.log(e);
      }
    }
    // Delete collection name from listOfCollections
    await deleteDoc(doc(firestore, "listOfCollections", listName));
    await updateCollections();
  };

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to the list containing the searched list
  const handleSearch = async (input) => {
    setSearchQuery(input);

    for (const coll of collections) {
      const collectionRef = query(collection(firestore, coll.name));
      const collItems = await getDocs(collectionRef);

      for (const listItem of collItems.docs) {
        if (listItem.id.toLowerCase().includes(input.toLowerCase())) {
          if (isClient) { // Ensure this runs only on client-side
            const listRef = listRefs.current[coll.name];
            if (listRef) {
              listRef.scrollIntoView({ behavior: 'smooth' });
              return;
            }
          }
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box id="outer-page" height={'90vh'} sx={{backgroundColor:'white'}}>
        <AppBar sx={{ backgroundColor: "#274c77", mb: 3}} position="static">
          <Toolbar>
            <SideDrawer />
            {/* Search Input */}
            <TextField
              id="search-input"
              label="Search Lists"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ maxWidth: '80%', margin: 2, backgroundColor: "white" }}
            />
          </Toolbar>
        </AppBar>
        <Box
          id="whole-page"
          width="100%"
          height="90%"
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
        >
          {filteredCollections.length > 3 ? (
            isSmallScreen ? (
              <Stack id="thin-stack" sx={{ width: '80vw', maxHeight: '80%' }} overflow={'auto'} direction="column" spacing={2}>
                {filteredCollections.map((list) => (
                  <Box ref={el => listRefs.current[list.name] = el} key={list.name}>
                    <InvList id={list.name} key={list.name} listName={list.name} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <ImageList id="grid" sx={{ margin: 'auto' }} width="90%" variant="quilted" cols={3} gap={10}>
                {filteredCollections.map((list) => (
                  <Box ref={el => listRefs.current[list.name] = el} key={list.name}>
                    <InvList key={list.name} listName={list.name} />
                  </Box>
                ))}
              </ImageList>
            )
          ) : (
            <Stack id="medium-stack" direction={{ xs: 'column', sm: 'row' }} sx={{ width: '80vw', maxHeight: '80%' }} overflow={'auto'} spacing={{ xs: 1, sm: 2, md: 4 }}>
              {filteredCollections.map((list) => (
                <Box ref={el => listRefs.current[list.name] = el} key={list.name}>
                  <InvList key={list.name} listName={list.name} />
                </Box>
              ))}
            </Stack>
          )}
          <Stack id="input-form" width="50%" direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id="outlined-basic"
              label="List name"
              variant="outlined"
              fullWidth
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
            <Stack direction={'row'}>
              <Button
                sx={{ width: "50%" }}
                variant="outlined"
                onClick={async () => {
                  await addCollection(listName);
                  setListName('');
                }}
              >
                Add
              </Button>
              <Button
                sx={{ width: "50%" }}
                variant="outlined"
                onClick={async () => {
                  await removeCollection(listName);
                  setListName('');
                }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
