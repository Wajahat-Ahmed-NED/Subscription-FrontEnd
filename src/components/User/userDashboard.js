import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, alpha } from '@material-ui/core/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
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
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@mui/icons-material/People';
// import Inbox from './inbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-solid-svg-icons';
// import Contact from './allorders';
// import Report from './report';
// import ItemCategories from './itemCategories';
// import Items from './items';
import { useHistory } from "react-router-dom";
// import { UserContext } from '../userContext';
import axios from 'axios';
import {
        BrowserRouter as Router,
        Switch,
        Route,
        Link
} from "react-router-dom";
import '../assets/css/style.css';
// import Allcustomers from './allcustomers';
// import Alllabs from './alllabs';
// import AllCategories from './allcategories';
// import Allindividuals from './allindividuals';
import Login from '../login';
// import Package from './package';
// import Subscription from './subscription';
// import Customer from './customer';
import Swal from 'sweetalert2';
import UserCustomer from './customer';
import UserSubscription from './UserSubscription';
import UserPackage from './UserPackage';

const drawerWidth = 240;

const linkTextColor = {
        color: "darkcyan",
        textDecoration: "none",
        // backgroundColor: "lightcyan"
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

function UserDashboard() {
        const classes = useStyles();
        const theme = useTheme();
        const [open, setOpen] = React.useState(true);
        const [refreshToken, setRefreshToken] = React.useState('');
        const [accessToken, setAccessToken] = React.useState('');
        const history = useHistory();

        const logout = () => {
                axios.post("http://localhost:5000/user/logout", { refreshToken: refreshToken },
                        {
                                headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                }
                        }).then((res) => {

                                localStorage.clear();
                                history.push('/')
                                Swal.fire(
                                        'Success',
                                        'Logout Successfully',
                                        'success',
                                )

                        }).catch((err) => {
                                console.log(err)
                                localStorage.clear();
                                history.push('/')
                        })
        };

        const changePassword = () => {
                history.push("/changePassword")
        }
        React.useEffect(() => {

                var adminToken = localStorage.getItem("admin")
                !adminToken && history.push("/")
                adminToken && setRefreshToken(JSON.parse(adminToken)?.tokens?.refreshToken)
                adminToken && setAccessToken(JSON.parse(adminToken)?.tokens?.accessToken)

        }, [])
        console.log(refreshToken)
        const handleDrawerOpen = () => {
                setOpen(true);
        };

        const handleDrawerClose = () => {
                setOpen(false);
        };

        return (
                <Router basename={process.env.PUBLIC_URL}>
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
                                                        User Panel
                                                </Typography>
                                                {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div> */}
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
                                                <Link style={linkTextColor} to="/customer">
                                                        <ListItem button>
                                                                <ListItemIcon>
                                                                        <AccountCircleIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Customer Details" />
                                                        </ListItem>
                                                </Link>
                                                <Link style={linkTextColor} to="/package">
                                                        <ListItem button>
                                                                <ListItemIcon>
                                                                        <InventoryIcon />

                                                                </ListItemIcon>
                                                                <ListItemText primary="Package Details" />
                                                        </ListItem>
                                                </Link>
                                                <Link style={linkTextColor} to="/subscription">
                                                        <ListItem button>
                                                                <ListItemIcon>
                                                                        <SubscriptionsIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Subscription Details" />
                                                        </ListItem>
                                                </Link>



                                        </List>
                                </Drawer>
                                <main className={classes.content}>
                                        <div className={classes.toolbar} />
                                        <Switch>
                                                <Route path='/customer' component={UserCustomer}></Route>
                                                <Route path='/package' component={UserPackage}></Route>
                                                <Route path='/subscription' component={UserSubscription}></Route>
                                                {/* <Route path='/all-Customers' component={Allcustomers}></Route>
                                                <Route path='/package' component={Package}></Route>
                                                <Route path='/subscription' component={Subscription}></Route>
                                                <Route path='/customer' component={Customer}></Route>
                                                <Route path='/all-Individuals' component={Allindividuals}></Route>
                                                <Route path='/all-Categories' component={AllCategories}></Route>
                                                <Route path='/Report' component={Report}></Route> */}
                                                <Route path='/login' component={Login}></Route>
                                        </Switch>

                                </main>
                        </div>
                </Router>
        );
}
export default UserDashboard 