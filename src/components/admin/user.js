import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import { addUser, deleteUser, getData, suspendUser, tempSuspendUser, getUser } from '../api/userApi';
import '../assets/css/user.css'
import { apiHandle } from '../api/api'
import Alert from 'react-bootstrap/Alert';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pb: 4,
    pl: 4
};

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

export default function ContactPage() {

    const handleOpen = () => setOpen(true);

    const dataFromRedux = useSelector((a) => a)

    const classes = useStyles();


    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [no, setNo] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState('');
    const [refreshToken, setRefreshToken] = React.useState('');
    const history = useHistory();
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [nodata, setNodata] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

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
        setPassword('')
        setError(false)

    };



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
                    deleteUser(e).then(function (response) {
                        setError(false)

                        Swal.fire(
                            'Success',
                            'User Deleted Successfully',
                            'success',
                        )
                        fetchData();
                    }).catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Could Not Delete User',
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

    const handleSubmit = async (e) => {

        if (!email || !fname || !lname || !user || !password || !phone || !cnic) {
            // setOpen(false);
            // return Swal.fire(
            //     'Incomplete Details',
            //     'Please Enter All Details',
            //     'error'
            // ).then(() => {
            //     setOpen(true)
            // })
            setError(true)
            setErrorMsg('Please Enter All Details')
            return
        }
        if (phone.length !== 11) {
            setError(true)
            setErrorMsg('Phone Number must be 11 characters')
            return
        } if (phone < 0) {
            setError(true)
            setErrorMsg('Phone Number cannot be negative')
            return
        }
        if (cnic.length !== 13) {
            setError(true)
            setErrorMsg('Cnic must be 13 characters')
            return
        }
        if (cnic < 0) {
            setError(true)
            setErrorMsg('Cnic cannot be negative')
            return
        }
        if (password.length <= 8) {
            setError(true)
            setErrorMsg('Password must be greater than 8 characters')
            return
        }
        if (! /^[a-zA-Z]+$/.test(fname)) {
            setError(true);
            setErrorMsg('First name can only contains letter');
            return
        }
        if (! /^[a-zA-Z]+$/.test(lname)) {
            setError(true);
            setErrorMsg('Last name can only contains letter');
            return
        }
        if (! /^[a-zA-Z]+$/.test(user)) {
            setError(true);
            setErrorMsg('User name can only contains letters and numbers');
            return
        }
        let obj = {
            Email: email,
            FirstName: fname,
            LastName: lname,
            Username: user,
            Password: password,
            PhoneNumber: phone,
            CNIC: cnic
        }
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            addUser(obj).then(function (response) {
                setOpen(false);
                setError(false)
                setErrorMsg('')
                Swal.fire(
                    'Success',
                    'User Created Successfully',
                    'success',
                )

                fetchData();
            }).catch(err => {
                setError(true)
                setErrorMsg(err?.response?.data?.message[0])
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Could Not Create User',
                //     text: 'Something went wrong!',
                // })
                // .then(() => { setOpen(true) })
            })
        })
    }

    const [openNew, setOpenNew] = React.useState(false);


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
    const dispatch = useDispatch()
    const fetchData = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getData().then((json) => {
                if (json.data.message[0] == "No users found" || json.data.data[0].length === 0) {
                    setNodata(true)
                    dispatch({
                        type: 'UPDATEUSERDATA',
                        userData: json.data.data
                    })
                }
                else {
                    setNodata(false)
                    setData(json.data.data)
                    dispatch({
                        type: 'UPDATEUSERDATA',
                        userData: json.data.data
                    })
                }
            }).catch((err) => console.log(err))
        })
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        if (dataFromRedux?.userData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.userData)
        }
    }, [])

    useEffect(() => {
        if (dataFromRedux?.userData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.userData)
        }
    }, [dataFromRedux?.userData?.length])
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [cnic, setCnic] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [suspend, setSuspend] = useState(0)
    const [tempSuspend, setTempSuspend] = useState(0)
    const [error, setError] = React.useState(false);
    const [id, setId] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleEdit = async (e) => {
        setEditModal(e)
        setFname(e.FirstName)
        setLname(e.LastName)
        setEmail(e.Email)
        setPhone(e.PhoneNumber)
        setOpen(true);
        setId(e.PKUserId)
    }
    const getDetails = async (e) => {

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getUser(e).then((res) => {
                handleModalOpen()
                setCurrentUser(res?.data?.data?.[0])
            }).catch(err => {
                console.log(err, "this error founnd")
            })
        })
    }

    const handleSuspend = async (e) => {
        setSuspend(e.IsSuspended ? false : true)
        let adminToken = localStorage.getItem("admin")
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Suspend it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }
        ).then(async (res) => {
            if (res.isConfirmed) {
                apiHandle(adminToken).then(() => {
                    suspendUser(e).then((res) => {
                        setError(false)

                        Swal.fire(
                            'Success',
                            'user Suspended Successfully',
                            'success',
                        )
                        fetchData();
                    }).catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Could Not Suspend User',
                            text: 'Something went wrong!',

                        })
                    })
                })
            } else if (

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
    const handleTempSuspend = async (e) => {
        setTempSuspend(e.IsTemporarySuspended ? false : true)
        let adminToken = localStorage.getItem("admin")
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Suspend it temporarily!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }
        ).then(async (res) => {
            if (res.isConfirmed) {
                apiHandle(adminToken).then(() => {
                    tempSuspendUser(e).then((res) => {
                        setError(false)

                        Swal.fire(
                            'Success',
                            'User Suspended Temporarily',
                            'success',
                        )
                        fetchData();
                    }).catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Could Not Suspend User Temporarily',
                            text: 'Something went wrong!',

                        })
                    })
                })
            } else if (

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
            setEditModal(null)
            setFname('')
            setLname('')
            setEmail('')
            setPhone('')
            setError(false)

            Swal.fire(
                'Success',
                'User Edited Successfully',
                'success',
            ).then((e) => {

            })
            fetchData();
        }).catch(err => {
            setOpen(false);
            Swal.fire({
                icon: 'error',
                title: 'Could Not Edit User',
                text: 'Something went wrong!',

            }).then((e) => {

                setOpen(true);

            })
        })




    }

    const handleTextField = (e) => {
        setId(parseInt(e.target.value))

    }

    return (
        <>
            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Users Details</h2>
                <Button className=" mb-3 me-3 " onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Create user <AddIcon /></Button>

            </div>

            <Modal
                open={modalOpen}

                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{ width: "100%", float: "right" }}>
                        <Tooltip onClick={handleModalClose} style={{ float: 'right', cursor: 'pointer' }} title="Close">
                            <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
                        </Tooltip>
                    </Box>
                    <Box style={{ width: "fit-content" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
                            User Detail
                        </Typography>
                    </Box>


                    <Grid container spacing={2}>

                        {currentUser?.FirstName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>First Name</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.FirstName}</Typography>

                        </Grid>}
                        {currentUser?.LastName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Last Name</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.LastName}</Typography>
                        </Grid>}

                        {currentUser?.Username && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Username</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.Username}</Typography>

                        </Grid>}

                        {currentUser?.Email && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Email Address</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.Email}</Typography>

                        </Grid>}



                        {currentUser?.PhoneNumber && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Phone No</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.PhoneNumber}</Typography>

                        </Grid>}
                        {currentUser?.CNIC && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>CNIC No</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.CNIC}</Typography>

                        </Grid>}

                        {currentUser?.createdAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Creation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.createdAt.split("T")[0]}</Typography>

                        </Grid>}

                        {currentUser?.updatedAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Updation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.updatedAt.split("T")[0]}</Typography>
                        </Grid>}

                        {currentUser?.SuspendedDate && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Suspension Date</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.SuspendedDate.split("T")[0]}</Typography>
                        </Grid>}

                        {currentUser?.TemporarySuspendedDate && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Temporary Suspension Date</Typography>
                            <Typography style={{ color: "black" }}>{currentUser?.TemporarySuspendedDate.split("T")[0]}</Typography>
                        </Grid>}
                    </Grid>
                </Box>
            </Modal>

            <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                <Backdrop className={classes.backdrop} open={openNew}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div >
                    <Dialog className="px-5" aria-labelledby="customized-dialog-title" open={open}>
                        <DialogTitle id="customized-dialog-title" className="mx-3" onClose={handleClose}>
                            {!EditModal ? 'Create User' : 'Edit User Details'}
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
                                            onChange={(e) => setUser(e.target.value)}
                                            variant="standard"
                                            required
                                            fullWidth
                                            name="text"
                                            label="Username"
                                            type="text"
                                            id="password"

                                            value={EditModal ? EditModal.Username : user}

                                        />
                                    </Grid>
                                    {
                                        !EditModal &&

                                        <Grid item xs={12}>
                                            <TextField
                                                onChange={(e) => setPassword(e.target.value)}
                                                variant="standard"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password ( Length Should be > 8)"
                                                type="password"
                                                id="password"
                                                autoComplete="current-password"

                                            />
                                        </Grid>
                                    }

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
                                            label="CNIC No (42101XXXXXXXXXXX) should be equal to 13"
                                            type="number"
                                            id="password"
                                            autoComplete="cnic"
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions className='mx-4 mb-2'>
                            <Button fullWidth onClick={!EditModal ? (e) => { handleSubmit(e) } : (e) => { handleEditSubmit(e) }} variant="contained" style={{ backgroundColor: "darkcyan" }}>
                                {

                                    !EditModal ? 'Create User' : 'Edit User Details'
                                }
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <TableContainer className={classes.container}  >
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead >
                            <TableRow >

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKUserID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>UserName</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                <TableCell align='center' style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>CNIC</TableCell>
                                <TableCell align='center' colSpan={4} style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>



                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7} align="center"><Typography> No data in table yet </Typography></TableCell>

                                </TableRow>
                            </TableBody> :
                                <TableBody>
                                    {

                                        data?.[0]?.map((e, i) => {
                                            return (
                                                <>
                                                    <TableRow hover={true}>
                                                        <TableCell>{e.PKUserId}</TableCell>
                                                        <TableCell>{e.Username}</TableCell>
                                                        <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                        <TableCell>{e.Email}</TableCell>
                                                        <TableCell>{e.PhoneNumber}</TableCell>
                                                        <TableCell>{e.CNIC}</TableCell>
                                                        <TableCell>
                                                            <Button variant="outlined" onClick={() => getDetails(e)}>Details</Button>
                                                        </TableCell>
                                                        <TableCell style={{ textAlign: 'left' }}>
                                                            <Tooltip title="Delete">
                                                                <IconButton><DeleteOutlineIcon variant="contained" color="error" onClick={() => handleDelete(e.PKUserId)} fontSize="medium" />
                                                                </IconButton></Tooltip>
                                                        </TableCell>
                                                        {
                                                            e.IsSuspended ? <TableCell style={{ color: 'red' }}>
                                                                <Typography>Suspended</Typography>
                                                            </TableCell> : <> <TableCell> <Button color="success" variant="contained" onClick={() => handleSuspend(e)}>Suspend</Button></TableCell>
                                                                {
                                                                    e.IsTemporarySuspended ? <TableCell style={{ color: 'red' }}><Typography style={{ width: 'max-content' }}>Temporary Suspended </Typography></TableCell> :
                                                                        <TableCell><Button color="success" variant="contained" style={{ width: 'max-content' }} onClick={() => handleTempSuspend(e)}>Temp Suspend</Button>

                                                                        </TableCell>
                                                                }</>
                                                        }
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


            </Paper>


        </>
    );
}
