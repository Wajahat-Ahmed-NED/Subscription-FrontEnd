import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getCustomers, getCustomerById, getCustomerBySubscriptionId } from '../api/customersApi';
import { apiHandle } from '../api/api'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '500px',
    display: 'block',
    bgcolor: 'background.paper',

    boxShadow: 24,
    pb: 4,
    pl: 4
};

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
    const dispatch = useDispatch()
    const classes = useStyles();

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [subsId, setSubsId] = React.useState(null);
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

    const getData = async () => {
        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(() => {
            getCustomerBySubscriptionId(subsId).then(json => {
                if (json.data.message[0] == "Customer is not subscribed to this subscription" || json.data.data[0].length === 0) {
                    setNodata(true)
                }
                else {
                    setNodata(false)
                    setData([json.data.data?.[0]?.["customer"]])
                }
            }).catch(err => {

                Swal.fire({
                    icon: 'error',
                    title: 'Could Not Found Customer',
                    text: 'Subscription Id Does Not Exist!',

                })
                console.log(err?.response)
            })
        })

    }

    const fetchData = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getCustomers().then((json) => {
                if (json.data.message[0] == "No customers found" || json.data.data[0].length === 0) {
                    setNodata(true)
                    dispatch({
                        type: "UPDATECUSTOMERDATA",
                        customerData: json.data.data?.[0]
                    })
                }
                else {
                    setNodata(false)
                    setData(json.data.data?.[0])
                    dispatch({
                        type: "UPDATECUSTOMERDATA",
                        customerData: json.data.data?.[0]
                    })
                }
            }).catch((err) => console.log(err))
        })

    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        if (dataFromRedux?.customerData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.customerData)
        }
    }, [])

    useEffect(() => {
        if (dataFromRedux?.customerData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.customerData)
        }
    }, [dataFromRedux?.customerData?.length])
    const [currentCustomer, setcurrentCustomer] = useState(null)

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [id, setId] = useState('')
    const [id2, setId2] = useState('')
    const [nodata, setNodata] = useState(false)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleTextField = (e) => {
        setId(e.target.value)

    }
    const handleUserTextField = (e) => {
        setId2(e.target.value)

    }

    const getDetails = async (e) => {

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getCustomerById(e).then((res) => {
                handleModalOpen()
                setcurrentCustomer(res?.data?.data?.[0])
            }).catch(err => {


                console.log(err, "this error found")

            })
        })
    }

    return (
        <>

            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Customers Details</h2>
                <div style={{ float: "right" }}>
                    <Grid container >
                        <Grid item xs={8}>
                            <input className="me-3" onChange={(e) => setSubsId(e.target.value)} placeholder='Customer by Subscription ID' type='number' style={{ height: '33px', outline: 'none', width: "215px" }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button className="mb-4 ms-1" onClick={() => getData()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

                        </Grid>
                    </Grid>

                </div>
            </div>

            <Modal
                open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box style={{ width: "100%", float: "right" }}>
                        <Tooltip style={{ float: 'right', cursor: 'pointer' }} onClick={handleModalClose} title="Close">
                            <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
                        </Tooltip>
                    </Box>
                    <Box style={{ width: "fit-content" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
                            Customer Detail
                        </Typography>
                    </Box>


                    <Grid container spacing={2}>

                        {currentCustomer?.FirstName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>First Name</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.FirstName}</Typography>
                        </Grid>}
                        {currentCustomer?.LastName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Last Name</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.LastName}</Typography>

                        </Grid>}

                        {currentCustomer?.Email && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Email Address</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.Email}</Typography>

                        </Grid>}



                        {currentCustomer?.PhoneNumber && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Phone No</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.PhoneNumber}</Typography>
                        </Grid>}

                        {currentCustomer?.CNIC && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>CNIC No</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.CNIC}</Typography>

                        </Grid>}



                        {currentCustomer?.Country && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Country</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.Country}</Typography>

                        </Grid>}

                        {currentCustomer?.City && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>City</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.City}</Typography>

                        </Grid>}

                        {currentCustomer?.Area && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Area</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.Area}</Typography>

                        </Grid>}

                        {currentCustomer?.Address && <Grid item xs={12}>
                            <Typography style={{ color: "darkcyan" }}>Address</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.Address}</Typography>

                        </Grid>}


                        {currentCustomer?.createdAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Creation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.createdAt.split("T")[0]}</Typography>
                        </Grid>}

                        {currentCustomer?.updatedAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Updation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentCustomer?.updatedAt.split("T")[0]}</Typography>
                        </Grid>}
                    </Grid>
                </Box>
            </Modal>
            <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                <Backdrop className={classes.backdrop} open={openNew}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <TableContainer className={classes.container} size='small'  >
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKCustomerID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>CNIC</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Address</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Country</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>City</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Area</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>




                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                                <TableRow>
                                    <TableCell colSpan={10} align="center"><Typography> No data in table yet </Typography></TableCell>

                                </TableRow>
                            </TableBody> : <TableBody>
                                {
                                    data?.map((e, i) => {
                                        return (
                                            <>
                                                <TableRow hover={true}>
                                                    <TableCell>{e.PKCustomerId}</TableCell>
                                                    <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                    <TableCell>{e.Email}</TableCell>
                                                    <TableCell>{e.PhoneNumber}</TableCell>
                                                    <TableCell>{e.CNIC}</TableCell>
                                                    <TableCell>{e.Address}</TableCell>
                                                    <TableCell>{e.Country}</TableCell>
                                                    <TableCell>{e.City}</TableCell>
                                                    <TableCell>{e.Area}</TableCell>
                                                    <TableCell><Button variant="outlined" onClick={() => getDetails(e)}>Details</Button></TableCell>

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
