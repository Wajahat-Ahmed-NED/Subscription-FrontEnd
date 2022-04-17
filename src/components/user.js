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
import { UserContext } from '../userContext';


import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import { addUser, deleteUser, getData, suspendUser, tempSuspendUser } from './api/userApi';
import './assets/css/user.css'

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

export default function ContactPage() {

    const handleOpen = () => setOpen(true);

    const dataFromRedux = useSelector((a) => a)
    console.log(dataFromRedux)

    const classes = useStyles();


    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [no, setNo] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState('');
    const [refreshToken, setRefreshToken] = React.useState('');
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
    };



    const handleDelete = async (e) => {
        console.log(typeof (e), e)
        console.log(accessToken)


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


                deleteUser(e).then(function (response) {

                    console.log(response, "hogaya")

                    Swal.fire(
                        'Success',
                        'User Deleted Successfully',
                        'success',
                    )
                    fetchData();
                }).catch(err => {
                    console.log(err.message, "this error founnd")
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',

                    })
                })
            }
            else if (

                res.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        }
        )

    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setOpen(false);
        let obj = {
            Email: email,
            FirstName: fname,
            LastName: lname,
            Username: user,
            Password: password,
            PhoneNumber: phone,
            CNIC: cnic
        }

        console.log("Password length", obj.Password.length)

        addUser(obj).then(function (response) {

            console.log(response, "hogaya")

            Swal.fire(
                'Success',
                'Admin Created Successfully',
                'success',
            )

            fetchData();
        }).catch(err => {
            console.log(err, "this error founnd")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong Credentials or Something went wrong!',
            })
            setOpen(true);
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

    const fetchData = () => {
        getData().then((json) => {
            setData(json.data.data)
            console.log(json.data.data)
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        fetchData()
    }, [])
    console.log(accessToken)

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
    const [disable, setDisable] = useState(false)
    const [id, setId] = useState('')
    const [filteredData, setFilteredData] = useState([])


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
        setId(e.PKUserId)




    }

    const handleSuspend = async (e) => {
        setSuspend(e.IsSuspended ? false : true)
        suspendUser(e).then((res) => {
            Swal.fire(
                'Success',
                'user Edited Successfully',
                'success',
            )
            fetchData();
        }).catch(err => {


            console.log(err, "this error founnd")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong Credentials or Something went wrong!',

            })
        })
        // setTempSuspend(e.IsTemporarySuspended ? false : true)
    }
    const handleTempSuspend = async (e) => {
        setTempSuspend(e.IsTemporarySuspended ? false : true)
        tempSuspendUser(e).then((res) => {
            Swal.fire(
                'Success',
                'user Edited Successfully',
                'success',
            )
            fetchData();
        }).catch(err => {


            console.log(err, "this error founnd")
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong Credentials or Something went wrong!',

            })
        })
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
                'user Edited Successfully',
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

    const handleTextField = (e) => {
        setId(parseInt(e.target.value))

    }

    return (
        <>
            <div className="container d-flex justify-content-between my-0">
                <h1 className='text-center mb-5'> Users Details</h1>
                <Button className=" mb-5 me-3 " onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Create user <AddIcon /></Button>

            </div>
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
                                        // {user.length>0 && disabled}
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
                <TableContainer className={classes.container} style={{ maxHeight: '390px', maxWidth: '1078px' }}>
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKUserID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>UserName</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>CNIC</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Suspend User</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Temporary Suspend</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Delete User</TableCell>



                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                            {

                                data[0]?.map((e, i) => {
                                    return (
                                        <>
                                            <TableRow hover={true}>
                                                <TableCell>{e.PKUserId}</TableCell>
                                                <TableCell>{e.Username}</TableCell>
                                                <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                <TableCell>{e.Email}</TableCell>
                                                <TableCell>{e.PhoneNumber}</TableCell>
                                                <TableCell>{e.CNIC}</TableCell>
                                                <TableCell >{e.IsSuspended ? 'True' : <Button color="success" onClick={() => handleSuspend(e)}>Suspend</Button>}</TableCell>
                                                <TableCell >{e.IsTemporarySuspended ? 'True' : <Button color="success" onClick={() => handleTempSuspend(e)}>Suspend</Button>}</TableCell>
                                                <TableCell style={{ textAlign: 'left' }}>

                                                    <Tooltip title="Delete">
                                                        <IconButton><DeleteOutlineIcon color="error" onClick={() => handleDelete(e.PKUserId)} fontSize="medium" />
                                                        </IconButton></Tooltip>
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


            </Paper>
            <div className="container d-flex justify-content-between mt-5">
                <h1 className='text-center mb-5'> Search By UserID</h1>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">User ID</InputLabel>
                    <Select
                        size='small'
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={id}
                        onChange={handleTextField}
                        label="UserID"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            data[0]?.map((e, i) => <MenuItem value={e.PKUserId}>{e.PKUserId}</MenuItem>)
                        }

                    </Select>
                </FormControl>

                <Button className=" mb-5 me-3 " onClick={() => setFilteredData(data[0]?.filter((ev) => ev.PKUserId === id))} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search <SearchIcon /></Button>


            </div>
            {
                filteredData.length > 0 && <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                    <Backdrop className={classes.backdrop} open={openNew}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <TableContainer className={classes.container} size='small' style={{ maxHeight: '390px', maxWidth: '1078px' }}>
                        <Table stickyHeader aria-label="sticky table" size='small' >
                            <TableHead>
                                <TableRow>

                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKUserID</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>UserName</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>CNIC</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Suspend User</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Temporary Suspend</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Temporary Suspend</TableCell>
                                    <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Delete User</TableCell>


                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                                {

                                    filteredData?.map((e, i) => {
                                        return (
                                            <>
                                                <TableRow hover={true}>
                                                    <TableCell>{e.PKUserId}</TableCell>
                                                    <TableCell>{e.Username}</TableCell>
                                                    <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                    <TableCell>{e.Email}</TableCell>
                                                    <TableCell>{e.PhoneNumber}</TableCell>
                                                    <TableCell>{e.CNIC}</TableCell>
                                                    <TableCell >{e.IsSuspended ? 'True' : <Button color="success" onClick={() => handleSuspend(e)}>Suspend</Button>}</TableCell>
                                                    <TableCell >{e.IsTemporarySuspended ? 'True' : <Button color="success" onClick={() => handleTempSuspend(e)}>Suspend</Button>}</TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>

                                                        <Tooltip title="Delete">
                                                            <IconButton><DeleteOutlineIcon color="error" onClick={() => handleDelete(e.PKUserId)} fontSize="medium" />
                                                            </IconButton></Tooltip>
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

                </Paper>
            }
        </>
    );
}
