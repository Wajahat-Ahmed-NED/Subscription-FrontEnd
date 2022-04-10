import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Link, useHistory } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { isJwtExpired } from 'jwt-check-expiration';
// import jwt from 'jsonwebtoken'
// import Button from '@mui/material/Button';
// import Button from '@mui/material/Button';
// import { logout } from './dashboard';
// import { UserContext } from '../userContext';
// import Modal from './modal';
// import Newmodal from './newmodal';
// import Modall from './modal';
// import { WebEdit } from './webeditor';
import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useDispatch, useSelector } from 'react-redux';
import axios, { Axios } from 'axios';
// import { UserContext } from '../userContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Alert } from 'bootstrap';


const useStyles = makeStyles((theme) => ({
        root: {
                position: "relative",
                zIndex: 0,
        },
        backdrop: {
                zIndex: theme.zIndex.drawer + 1,
                color: '#fff',
        },
        container: {
                maxHeight: 500,
                // borderRadius: 20,
        },
}));
const styles = (theme) => ({
        root: {
                margin: 0,
                padding: theme.spacing(2),
        },
        closeButton: {
                position: 'absolute',
                right: theme.spacing(1),
                top: theme.spacing(1),
                color: theme.palette.grey[500],
        },
});
const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
                <MuiDialogTitle disableTypography className={classes.root} {...other}>
                        <Typography variant="h6">{children}</Typography>
                        {onClose ? (
                                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                                        <CloseIcon />
                                </IconButton>
                        ) : null}
                </MuiDialogTitle>
        );
});


const DialogContent = withStyles((theme) => ({
        root: {
                padding: theme.spacing(2),
        },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
        root: {
                margin: 0,
                padding: theme.spacing(1),
        },
}))(MuiDialogActions);

export default function UserCustomer() {
        // const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        // const handleClose = () => setOpen(false);
        const dataFromRedux = useSelector((a) => a)
        // const dispatch = useDispatch()

        // const handleUpdate = () => {
        //   const obj = {
        //     name: 'ali',
        //     age: 12,
        //     apiData: [1, 2, 3, 4],
        //   }
        //   console.log(obj)
        //   dispatch({ type: 'DATAFROMAPI', ...obj })
        //   console.log(dataFromRedux)
        // }
        console.log(dataFromRedux)

        const classes = useStyles();


        const [page, setPage] = React.useState(0);
        const [rows, setRow] = useState([]);
        const [no, setNo] = useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(10);
        const [open, setOpen] = React.useState(false);
        const [accessToken, setAccessToken] = React.useState('');
        const [refreshToken, setRefreshTokn] = React.useState('');
        const history = useHistory();
        const handleClickOpen = () => {
                setOpen(true);
        };
        const handleClose = () => {
                setOpen(false);
                setEditModal(null)
                setFname('')
                setLname('')
                setEmail('')
                setPhone('')
                setPhone('')
                setCnic('')
                setAddress('')
                setCountry('')
                setCity('')
                setArea('')
        };

        // const accessToken = '';
        // const refreshToken;



        const handleSubmit = async (e) => {
                e.preventDefault()


                let obj = {
                        FirstName: fname,
                        LastName: lname,
                        Email: email,
                        PhoneNumber: phone,
                        CNIC: cnic,
                        Address: address,
                        Country: country,
                        City: city,
                        Area: area
                }

                console.log(fname,
                        lname,
                        email,
                        phone,
                        cnic, address, country, city, area
                )

                await axios.post('http://localhost:5000/user/addCustomer', obj,
                        {
                                headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                }
                        }
                ).then(function (response) {
                        setOpen(false);
                        console.log(response, "hogaya")

                        Swal.fire(
                                'Success',
                                'Customer Created Successfully',
                                'success',
                        )
                        // setOpen(false);
                        getData();
                }).catch(err => {
                        setOpen(false);
                        console.log(err, "this error founnd")
                        Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',

                        }).then((e) => {
                                setOpen(true);
                        })
                })
        }

        const [openNew, setOpenNew] = React.useState(false);
        const [error, setError] = React.useState(false);
        const [subsId, setSubsId] = React.useState(null);

        // const { setToken } = useContext(UserContext);
        // here useeffect will be implemented
        console.log(rows, "get ALL orders");

        const handleEditRow = (idEdit, row) => {
                let filteredRow = rows.filter(({ id }) => {
                        return id !== idEdit
                })

                setRow([...filteredRow, row])
        }

        const handleChangePage = (event, newPage) => {
                setPage(newPage);
        };


        const [data, setData] = useState([])
        const getData = async () => {
                console.log("getCustomer")
                const api = `http://localhost:5000/user/getPackageBySubscriptionId/${subsId}`
                await axios.get(api)
                        .then(json => {
                                setData(json.data)
                                console.log(json.data)
                        })
                        .catch(err => {
                                console.log(err)
                        })
        }
        useEffect(() => {
                // getData()
                var adminToken = localStorage.getItem("admin")
                adminToken && setAccessToken(JSON.parse(adminToken)?.tokens?.accessToken)
        }, [])
        console.log(accessToken)

        const [fname, setFname] = useState('')
        const [lname, setLname] = useState('')
        const [email, setEmail] = useState('')
        const [user, setUser] = useState('')
        const [password, setPassword] = useState('')
        const [phone, setPhone] = useState('')
        const [cnic, setCnic] = useState('')
        const [address, setAddress] = useState('')
        const [country, setCountry] = useState('')
        const [city, setCity] = useState('')
        const [area, setArea] = useState('')
        const [EditModal, setEditModal] = useState(false)
        const [id, setId] = useState(0)
        const [disable, setDisable] = useState(false)

        const handleChangeRowsPerPage = (event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
        };



        const handleEdit = async (e) => {
                // e.preventDefault()

                setEditModal(e)
                setFname(e.FirstName)
                setLname(e.LastName)
                setEmail(e.Email)
                setPhone(e.PhoneNumber)
                // setCnic(e.Email)
                // setUser(e.user)
                console.log(e)
                setOpen(true);
                setId(e.PKAdminId)




        }

        const handleEditSubmit = async (e) => {
                let obj = {
                        Email: email,
                        FirstName: fname,
                        LastName: lname,
                        PhoneNumber: phone,

                }

                await axios.put(`http://localhost:5000/admin/updateProfile/${id}`, obj,
                        {
                                headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                }
                        }
                ).then(function (response) {

                        setOpen(false);
                        console.log(response, "hogaya")
                        setEditModal(null)
                        setFname('')
                        setLname('')
                        setEmail('')
                        setPhone('')
                        Swal.fire(
                                'Success',
                                'Admin Edited Successfully',
                                'success',
                        ).then((e) => {

                        })
                        getData();
                }).catch(err => {
                        setOpen(false);

                        console.log(err, "this error founnd")
                        Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Wrong Credentials or Something went wrong!',

                        }).then((e) => {

                                setOpen(true);

                        })
                })




        }
        return (
                <>
                        {/* <button className='btn btn-primary' onClick={handleUpdate}>Bootstrap</button> */}
                        <div className="container d-flex justify-content-between my-0">
                                <h1 className='text-center mb-5'> Customer Details</h1>
                                {
                                        error && <Alert variant="danger" onClose={() => setError(false)} dismissible>
                                                <p className="text-center" style={{ fontWeight: 'bold' }}>Session Expired</p>
                                        </Alert>
                                }
                                {/* <Button className="ms-auto me-3 my-3" onClick={getData} size='small' style={{ backgroundColor: 'darkCyan' }} variant="contained">Get Data</Button> */}
                                <Button className=" mb-5 me-3 " onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Create Customer <AddIcon /></Button>


                        </div>
                        <div class="container">
                                <h4>Get Customer by Subscription ID</h4>
                                <Grid container >



                                        <Grid item xs={2}>


                                                <input placeholder='Enter Subscription ID' type='number' style={{ height: '33px', outline: 'none' }}
                                                        onChange={(e) => setSubsId(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={2}>
                                                <Button className=" mb-5  " onClick={() => getData()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

                                        </Grid>
                                </Grid>
                        </div>


                        <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                                <Backdrop className={classes.backdrop} open={openNew}>
                                        <CircularProgress color="inherit" />
                                </Backdrop>
                                <div >
                                        <Dialog className="px-5" aria-labelledby="customized-dialog-title" open={open}>
                                                <DialogTitle id="customized-dialog-title" className="mx-3" onClose={handleClose}>
                                                        {!EditModal ? 'Create Customer' : 'Edit Customer Details'}
                                                </DialogTitle>
                                                <DialogContent dividers className='mx-3'>
                                                        <form className={classes.form} noValidate>
                                                                <Grid container spacing={2}>

                                                                        <Grid item xs={6}>
                                                                                <TextField

                                                                                        onChange={(e) => setFname(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="text"
                                                                                        label="First Name"
                                                                                        type="text"
                                                                                        id="password"
                                                                                        value={fname}
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={5} className="ms-auto">
                                                                                <TextField
                                                                                        onChange={(e) => setLname(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="text"
                                                                                        label="Last Name"
                                                                                        type="text"
                                                                                        id="password"
                                                                                        value={lname}
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        id="email"
                                                                                        label="Email Address"
                                                                                        name="email"
                                                                                        autoComplete="email"
                                                                                        value={email}
                                                                                />
                                                                        </Grid>




                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setPhone(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="Phone No"
                                                                                        label="Phone No (0300-XXXXXXX)"
                                                                                        type="number"
                                                                                        id="password"
                                                                                        autoComplete="phoneNumber"
                                                                                        value={phone}
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setCnic(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="CNIC"
                                                                                        label="CNIC No (42202XXXXXXXXXXX) should be equal to 13"
                                                                                        type="number"
                                                                                        id="password"
                                                                                        autoComplete="cnic"
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setAddress(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="Address"
                                                                                        label="Address"
                                                                                        type="text"
                                                                                        // id="password"
                                                                                        autoComplete="address"
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setCountry(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="Country"
                                                                                        label="Country"
                                                                                        type="text"
                                                                                        // id="password"
                                                                                        autoComplete="country"
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setCity(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="City"
                                                                                        label="City"
                                                                                        type="text"
                                                                                        // id="password"
                                                                                        autoComplete="city"
                                                                                />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                                <TextField
                                                                                        onChange={(e) => setArea(e.target.value)}
                                                                                        variant="standard"
                                                                                        required
                                                                                        fullWidth
                                                                                        name="Area"
                                                                                        label="Area"
                                                                                        type="text"
                                                                                        // id="password"
                                                                                        autoComplete="area"
                                                                                />
                                                                        </Grid>
                                                                </Grid>
                                                        </form>
                                                </DialogContent>
                                                <DialogActions className='mx-4 mb-2'>
                                                        <Button fullWidth onClick={!EditModal ? (e) => { handleSubmit(e) } : (e) => { handleEditSubmit(e) }} variant="contained" style={{ backgroundColor: "darkcyan" }}>
                                                                {

                                                                        !EditModal ? 'Create Customer' : 'Edit Customer Details'
                                                                }
                                                        </Button>
                                                </DialogActions>
                                        </Dialog>
                                </div>
                                <TableContainer className={classes.container} size='small' style={{ maxHeight: '390px', maxWidth: '1078px' }}>
                                        <Table stickyHeader aria-label="sticky table" size='small' >
                                                <TableHead>
                                                        <TableRow>

                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKAdminID</TableCell>
                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>UserName</TableCell>
                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>



                                                        </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                                                        {
                                                                data?.map((e, i) => {
                                                                        return (
                                                                                <>
                                                                                        <TableRow hover={true}>
                                                                                                <TableCell>{e.PKAdminId || e.PKCustomerId}</TableCell>
                                                                                                <TableCell>{e.Username}</TableCell>
                                                                                                <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                                                                <TableCell>{e.Email}</TableCell>
                                                                                                <TableCell>{e.PhoneNumber}</TableCell>
                                                                                                <TableCell style={{ textAlign: 'left' }}>
                                                                                                        <Tooltip title="Edit" onClick={() => handleEdit(e)}>
                                                                                                                <IconButton><EditIcon color="success" fontSize="medium" />
                                                                                                                </IconButton></Tooltip>
                                                                                                        {/* <Tooltip title="Delete">
                            <IconButton><DeleteOutlineIcon color="error" onClick={() => handleDelete(e.PKAdminId)} fontSize="medium" /></IconButton></Tooltip> */}
                                                                                                </TableCell>
                                                                                        </TableRow>

                                                                                </>
                                                                        )
                                                                })
                                                        }
                                                </TableBody>
                                        </Table>
                                </TableContainer>
                                <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                                {/* <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
</div> */}
                                {/* <!-- Button trigger modal --> */}

                        </Paper>
                </>
        );
}
