import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, alpha } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InventoryIcon from '@mui/icons-material/Inventory';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import '../assets/css/style.css';
import User from './user';
import Login from './login';
import Package from './package';
import Subscription from './subscription';
import Customer from './customer';
import { api, apiHandle } from "../api/api"
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../api/userApi';
import { getSubscriptions } from '../api/subscriptionApi';
import { getCustomers } from '../api/customersApi';
import { getPackages } from '../api/packageApi';

const drawerWidth = 240;

const linkTextColor = {
  color: "darkcyan",
  textDecoration: "none",
  '&:hover': {
    backgroundColor: 'lightcyan',
  },
};


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'darkcyan'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }), backgroundColor: 'darkcyan'
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [refreshToken, setRefreshToken] = React.useState('');
  const [accessToken, setAccessToken] = React.useState('');
  const history = useHistory();

  const dataFromRedux = useSelector(a => a)
  console.log(dataFromRedux)


  const logout = () => {
    axios.post(`${api}admin/logout`, { refreshToken: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((res) => {
        localStorage.clear();
        window.location.replace("/")

      }).catch((err) => {
        console.log(err)
        localStorage.clear();
      })
  };

  const changePassword = () => {
    history.push("/changePassword")
  }
  const updateProfile = () => {
    history.push("/updateProfile")
  }

  const dispatch = useDispatch()
  React.useEffect(() => {

    var adminToken = localStorage.getItem("admin")
    !adminToken && history.push("/")
    adminToken && setRefreshToken(JSON.parse(adminToken)?.data?.[0]?.refreshToken)
    adminToken && setAccessToken(JSON.parse(adminToken)?.data?.[0]?.accessToken)


    apiHandle(adminToken).then(() => {

      getData().then((json) => {

        dispatch({
          type: 'DATAFROMLOGIN',
          userData: json.data.data
        })

      }).catch((err) => console.log(err))


      getPackages().then((json) => {

        dispatch({
          type: 'DATAFROMLOGIN',
          packageData: json.data.data[0]
        })

      }).catch((err) => console.log(err))


      getSubscriptions().then((json) => {

        dispatch({
          type: 'DATAFROMLOGIN',
          subscriptionData: json.data.data
        })

      }).catch((err) => console.log(err))



      getCustomers().then((json) => {

        dispatch({
          type: 'DATAFROMLOGIN',
          customerData: json.data.data?.[0]
        })

      }).catch((err) => console.log(err))

    })

  }, [])


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router >
      <div className={classes.root}>
        <CssBaseline />
        <AppBar

          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >


          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h5" noWrap>
              Admin Panel
            </Typography>
            <Button onClick={updateProfile} color="inherit">Update Profile</Button>
            <Button onClick={changePassword} color="inherit">Change Password</Button>
            <Button onClick={logout} color="inherit">Logout</Button>

          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <h4 style={linkTextColor} className="mt-2">Subscription <br /> Management</h4>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>




          </div>

          <Divider />
          <List className='my-5 ' >

            <Link style={linkTextColor} to="/dashboard/user">
              <ListItem button>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users Details" />
              </ListItem>
            </Link>
            <Link style={linkTextColor} to="/dashboard/package">
              <ListItem button>
                <ListItemIcon>
                  <InventoryIcon />

                </ListItemIcon>
                <ListItemText primary="Package Details" />
              </ListItem>
            </Link>
            <Link style={linkTextColor} to="/dashboard/subscription">
              <ListItem button>
                <ListItemIcon>
                  <SubscriptionsIcon />
                </ListItemIcon>
                <ListItemText primary="Subscription Details" />
              </ListItem>
            </Link>
            <Link style={linkTextColor} to="/dashboard/customer">
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Customer Details" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path='/dashboard/user' component={User}></Route>
            <Route path='/dashboard/package' component={Package}></Route>
            <Route path='/dashboard/subscription' component={Subscription}></Route>
            <Route path='/dashboard/customer' component={Customer}></Route>
            <Route path='/login' component={Login}></Route>
          </Switch>

        </main>
      </div>
    </Router>
  );
}
export default Dashboard 