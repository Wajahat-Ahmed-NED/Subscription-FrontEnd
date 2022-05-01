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
import Alert from 'react-bootstrap/Alert';
import { apiHandle } from "../api/user/api"
import { addCustomer, editCustomer, deleteCustomer, getCustomerBySubscriptionId } from '../api/user/userCustomersApi';

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
    // console.log(dataFromRedux)

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
        setCnic('')
        setAddress('')
        setCountry('')
        setCity('')
        setArea('')
        setError(false)
        setErrorMsg('')
    };

    // const accessToken = '';
    // const refreshToken;



    const handleSubmit = async (e) => {
        // e.preventDefault()
        if(!fname || !lname || !email || !phone || !cnic || !address || !country ||!city ||!area)
        {
            setOpen(false);
            return Swal.fire(
                'Incomplete Details',
                'Please Enter All Details',
                'error'
            ).then(()=>{
                setOpen(true)
            })
        }
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
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            addCustomer(obj).then(function (response) {
                setOpen(false);
                Swal.fire(
                    'Success',
                    'Customer Created Successfully',
                    'success',
                )
            }).catch(err => {
                setOpen(false);
                setError(true)
                setErrorMsg(err?.response?.data?.message[0])
                Swal.fire({
                    icon: 'error',
                    title: 'Could  not create customer',
                    text: 'Something went wrong!',

                }).then((e) => {
                    setOpen(true);
                })
            })
        })

    }

    const [openNew, setOpenNew] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [subsId, setSubsId] = React.useState(null);


    const handleEditRow = (idEdit, row) => {
        let filteredRow = rows.filter(({ id }) => {
            return id !== idEdit
        })

        setRow([...filteredRow, row])
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [errorMsg, setErrorMsg] = useState('')

    const [data, setData] = useState([])
    const getData = async () => {
        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(() => {
            getCustomerBySubscriptionId(subsId).then(json => {
                if (json.data.message[0] == "Customer is not subscribed to this subscription" || json.data.data[0].length === 0) {
                    setNodata(true)
                }
                else {
                    setNodata(false)
                    setData(json.data.data)
                }
            })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Could Not Found Customer',
                        text: 'Subscription Id Does Not Exist!'

                    })
                    console.log(err)
                })
        })

    }
    useEffect(() => {
        var adminToken = localStorage.getItem("admin")
        adminToken && setAccessToken(JSON.parse(adminToken)?.data?.[0]?.accessToken)

    }, [])
    // console.log(accessToken)
    const [nodata, setNodata] = useState(true)

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
    const [id, setId] = useState(null)
    const [disable, setDisable] = useState(false)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleEdit = async (e) => {
        // e.preventDefault()

        setEditModal(e)
        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(() => {
            getCustomerBySubscriptionId(subsId).then(json => {
                setFname(json.data.data[0].FirstName)
                setLname(json.data.data[0].LastName)
                setEmail(json.data.data[0].Email)
                setPhone(json.data.data[0].PhoneNumber)
                setCnic(json.data.data[0].CNIC)
                setAddress(json.data.data[0].Address)
                setCountry(json.data.data[0].Country)
                setCity(json.data.data[0].City)
                setArea(json.data.data[0].Area)
                setOpen(true);
                setId(json.data.data[0].PKCustomerId)
            }).catch(err=>{
                console.log(err)
            })
        })
        
    }
    const handleDelete = async (e) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }
        ).then(async (res) => {
            if (res.isConfirmed) {

                let adminToken = localStorage.getItem("admin")
                apiHandle(adminToken).then(() => {
                    deleteCustomer(e).then(function (response) {

                        Swal.fire(
                            'Success',
                            'Customer Deleted Successfully',
                            'success',
                        )
                        setData([]);
                    }).catch(err => {
                        console.log(err.response, "this error founnd")
                        Swal.fire({
                            icon: 'error',
                            title: 'Could Not Delete',
                            text: 'Something went wrong!',

                        })
                    })
                })
            }
            else if (

                res.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    'Cancelled',
                    '',
                    'error'
                )
            }
        }
        )

    }

    const handleEditSubmit = async () => {
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

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            editCustomer(id, obj).then(function (response) {

                setOpen(false);
                setEditModal(null)
                setFname('')
                setLname('')
                setEmail('')
                setPhone('')
                Swal.fire(
                    'Success',
                    'Customer Edited Successfully',
                    'success',
                )
                getData();
            }).catch(err => {
                setOpen(false);
                setError(true)
                setErrorMsg(err?.response?.data?.message[0])
                Swal.fire({
                    icon: 'error',
                    title: 'Could Not Edit Customer',
                    text: 'Wrong Credentials or Something went wrong!',

                }).then((e) => {

                    setOpen(true);

                })
            })
        })
    }
    return (
        <>
            {/* <button className='btn btn-primary' onClick={handleUpdate}>Bootstrap</button> */}
            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Customer Details</h2>
                <div style={{float:"right"}}>
                <Grid container >
                    <Grid item xs={5}>
                        <input placeholder='Customer by Subscription ID' type='number' style={{ height: '33px', outline: 'none', width:"215px"}}
                            onChange={(e) => setSubsId(e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button className="mb-4 me-3" onClick={() => getData()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

                    </Grid>
                    <Grid item xs={5} style={{maxWidth:'unset'}}>
                    <Button className=" mb-3 ms-3 me-4" onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder",width:'max-content' }} variant="contained">Create Customer <AddIcon /></Button>

                    </Grid>
                </Grid>
                
                
                </div>
                

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

                            {
                                error && <Alert variant="danger" onClose={() => setError(false)} dismissible>
                                    <p className="text-center" style={{ fontWeight: 'bold' }}>{errorMsg}</p>
                                </Alert>
                            }
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
                                            value={cnic}
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
                                            value={address}
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
                                            value={country}
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
                                            value={city}
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
                                            value={area}
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
                <TableContainer className={classes.container} size='small' style={{ maxHeight: '670px' }}>
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKCustomerID</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                <TableCell align='center' colSpan={2} style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>

                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5} align="center"><Typography> No data in table yet </Typography></TableCell>

                                </TableRow>
                            </TableBody> : <TableBody>
                                {
                                    data?.map((e, i) => {
                                        return (
                                            <>
                                                <TableRow hover={true}>
                                                    <TableCell>{e.PKAdminId || e.PKCustomerId}</TableCell>
                                                    <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                    <TableCell>{e.Email}</TableCell>
                                                    <TableCell>{e.PhoneNumber}</TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>
                                                        <Tooltip title="Edit" onClick={() => handleEdit(e)}>
                                                            <IconButton><EditIcon color="success" fontSize="medium" />
                                                            </IconButton></Tooltip>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>
                                                        <Tooltip title="Delete">
                                                            <IconButton><DeleteOutlineIcon variant="contained" color="error" onClick={() => handleDelete(e.PKCustomerId)} fontSize="medium" />
                                                            </IconButton></Tooltip>
                                                    </TableCell>
                                                </TableRow>

                                            </>
                                        )
                                    })
                                }
                            </TableBody>
                        }

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
