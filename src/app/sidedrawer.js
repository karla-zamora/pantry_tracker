import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddHomeIcon from '@mui/icons-material/AddHome';
import BoltIcon from '@mui/icons-material/Bolt';
import { Typography } from '@mui/material';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
          <ListItem key='lists-page' disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AddHomeIcon/>
              </ListItemIcon>
              <ListItemText primary="Home page" />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem key='ai-page' disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BoltIcon/>
              </ListItemIcon>
              <ListItemText primary="AI classification" />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)} variant="outlined"><Typography color={"white"}>MENU</Typography></Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
