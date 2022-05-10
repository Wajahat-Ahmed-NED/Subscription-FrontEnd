import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { MDBBtn } from 'mdb-react-ui-kit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tooltip from '@mui/material/Tooltip';
import Alert from 'react-bootstrap/Alert';
import { apiHandle } from '../api/user/api'
import { addPackage, getPackage, deletePackage, editPackage, getPackageById, sendOtp, verifySubscription } from '../api/user/userPackageApi';
import { billGeneration } from '../api/user/userBillingApi';
import { getSubscription } from '../api/user/userSubscriptionApi'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pb: 4,
    pt: 2,
    pl: 2,
    pr: 2
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

export default function UserPackage() {

    const handleOpen = () => setOpen(true);

    const dataFromRedux = useSelector((a) => a)

    const [nodata, setNodata] = useState(false)

    const classes = useStyles();
    const [errorMsg, setErrorMsg] = useState('')
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [submodalOpen, setSubModalOpen] = React.useState(false);
    const handleSubModalOpen = () => setSubModalOpen(true);
    const handleSubModalClose = () => setSubModalOpen(false);
    const [billmodalOpen, setBillModalOpen] = React.useState(false);
    const handleBillModalOpen = () => setBillModalOpen(true);
    const handleBillModalClose = () => setBillModalOpen(false);
    const [currentPackage, setcurrentPackage] = useState(null)
    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [no, setNo] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState('');

    const history = useHistory();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setError(false);
        setErrorMsg('');
        setEditModal(null)
        setpackageName('')
        setpackageCost('')
        setperiod('')
        setPhone('')
    };

    const getDetails = async (e) => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getPackageById(e).then((res) => {
                handleModalOpen()
                setcurrentPackage(res?.data?.data?.[0])
            }).catch(err => {
                console.log(err?.response?.data?.message)
            })
        })
    }

    const subscribe = async (e) => {
        setId(e.PKPackageId)
        setPhone('')
        setOtp('')
        setDisplayStyle("none")
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            handleSubModalOpen()
        })
    }

    const getOtp = async () => {
        if (!phone) {
            setError(true)
            setErrorMsg('Please Enter Phone Number')
            return

        }
        if (phone.length !== 11) {
            setError(true)
            setErrorMsg('Phone number must be 11 character long')
            return
        }
        const obj = {
            "PhoneNumber": phone,
            "FKPackageId": id
        }
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            sendOtp(obj).then((res) => {
                setSubModalOpen(false)
                setDisplayStyle("block")
                setError(false)
                Swal.fire(
                    'Success',
                    'Otp sent Successfully',
                    'success',
                ).then(() => {
                    setSubModalOpen(true)
                })
            }).catch(err => {
                setDisplayStyle("none")
                console.log(err?.response)
                if (err?.response?.data?.message?.[0] === "Subscription already exists") {

                    setError(true)
                    setErrorMsg('Subscription Already Exists')
                    return
                }
                else {
                    setError(true)
                    setErrorMsg('Invalid Phone Number')
                    return
                }
            })
        })
    }
    const generateBill = async () => {

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getSubscription().then((res) => {
                console.log(res?.data?.data?.[0])
                let subscriptionId = Math.max(...res?.data?.data?.[0].map(o => o.PKSubscriptionId));
                let obj = {
                    "FKSubscriptionId": subscriptionId
                }
                billGeneration(obj).then((res) => {
                    console.log(res)
                    setBillModalOpen(false)
                    setError(false)
                    Swal.fire(
                        'Success',
                        'Bill Generated Successfully',
                        'success',
                    )
                    getSubscription().then(json => {
                        dispatch({
                            type: 'UPDATESUBSCRIPTIONDATA',
                            subscriptionData: json?.data?.data[0],
                            billingData: json?.data?.data[1][0]
                        })

                    })
                }).catch(err => {
                    console.log(err?.response)
                    Swal.fire(
                        'Bill Not Generated',
                        'Invalid credentials or something went wrong',
                        'success',
                    )
                })
            }).catch(err => {
                console.log(err?.response)
            })
        })
    }



    const verifySubs = async () => {
        const obj = {
            "Otp": otp,
            "PhoneNumber": phone,
            "FKPackageId": id
        }
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            verifySubscription(obj).then((res) => {
                setSubModalOpen(false)
                setDisplayStyle("none")
                setError(false)
                Swal.fire(
                    'Success',
                    'Subscribed Successfully',
                    'success',
                ).then(() => {
                    setBillModalOpen(true)

                })

                getSubscription().then(json => {
                    dispatch({
                        type: 'UPDATESUBSCRIPTIONDATA',
                        subscriptionData: json?.data?.data[0],
                        billingData: json?.data?.data[1][0]
                    })

                })
            })
                .catch(err => {
                    setSubModalOpen(false)
                    setDisplayStyle("block")
                    console.log(err?.response)
                    Swal.fire(
                        'Cannot Verify Otp',
                        err?.response?.data?.message?.[0],
                        'error',
                    ).then(() => {
                        setSubModalOpen(true)
                    })
                })
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!packageName || !packageCost || !period) {
            setError(true);
            setErrorMsg('Please Enter All Details');
            return

        }
        if (packageCost <= 0) {
            setError(true);
            setErrorMsg('Package Cost should be greater than zero');
            return
        }
        if (period <= 0) {
            setError(true);
            setErrorMsg('Subscripton period should be greater than zero');
            return
        }
        if (! /^[a-zA-Z]+$/.test(packageName)) {
            setError(true);
            setErrorMsg('Package name can only contains letter');
            return
        }
        let obj = {
            PackageName: packageName,
            PackageCost: packageCost,
            SubscriptionPeriod: period,

        }
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            addPackage(obj).then(function (response) {
                setOpen(false);
                setError(false);
                setErrorMsg('');
                Swal.fire(
                    'Success',
                    'Package Created Successfully',
                    'success',
                )
                getData();
            }).catch(err => {
                setError(true)
                setErrorMsg(err?.response?.data?.message[0])

            })
        })

    }

    const [openNew, setOpenNew] = React.useState(false);
    const [error, setError] = React.useState(false);


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
            getPackage().then(json => {
                if (json.data.message[0] == "No packages of current user found" || json.data.data[0].length === 0) {
                    setNodata(true)
                    dispatch({
                        type: 'UPDATEPACKAGEDATA',
                        packageData: json.data.data[0]
                    })
                }
                else {
                    setNodata(false)
                    setData(json.data.data[0])
                    dispatch({
                        type: 'UPDATEPACKAGEDATA',
                        packageData: json.data.data[0]
                    })
                }
            })
                .catch(err => {
                    console.log(err)
                })
        })

    }
    const dispatch = useDispatch()

    useEffect(() => {

        var adminToken = localStorage.getItem("admin")
        adminToken && setAccessToken(JSON.parse(adminToken)?.data?.data?.[0]?.accessToken)
        if (dataFromRedux?.packageData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.packageData)
        }
    }, [])

    useEffect(() => {
        if (dataFromRedux?.packageData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.packageData)
        }
    }, [dataFromRedux?.packageData?.length])
    const [packageName, setpackageName] = useState('')
    const [packageCost, setpackageCost] = useState('')
    const [period, setperiod] = useState('')
    const [displayStyle, setDisplayStyle] = useState('none')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [id, setId] = useState(0)
    const [disable, setDisable] = useState(false)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleEdit = async (e) => {
        setEditModal(e)
        setModalOpen(false)
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getPackageById(e).then((res) => {
                setpackageName(res?.data?.data?.[0].PackageName)
                setpackageCost(res?.data?.data?.[0].PackageCost)
                setperiod(res?.data?.data?.[0].SubscriptionPeriod)
                setOpen(true);
                setId(res?.data?.data?.[0].PKPackageId)
            }).catch(err => {
                console.log(err?.response)
            })
        })

    }

    const handleDelete = async (e) => {
        setModalOpen(false)
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
                    console.log(e)
                    deletePackage(e).then(function (response) {
                        setError(false)

                        Swal.fire(
                            'Success',
                            'Package Deleted Successfully',
                            'success',
                        )
                        setData([]);
                        getData();
                    }).catch(err => {
                        console.log(err?.response?.data?.message?.[0])
                        Swal.fire({
                            icon: 'error',
                            title: 'Could Not Delete Package',
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
    const handleEditSubmit = async (e) => {
        if (!packageName || !packageCost || !period) {

            setError(true);
            setErrorMsg('Please Enter All Details');
            return

        }
        if (! /^[a-zA-Z]+$/.test(packageName)) {
            setError(true);
            setErrorMsg('Package name can only contains letter');
            return
        }
        let obj = {
            SubscriptionPeriod: period,
            PackageName: packageName,
            PackageCost: packageCost,
        }

        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(() => {
            editPackage(id, obj).then(function (response) {
                setOpen(false);
                setEditModal(null)
                setError(false)
                setErrorMsg('')
                setpackageName('')
                setpackageCost('')
                setperiod('')
                setPhone('')
                setError(false)

                Swal.fire(
                    'Success',
                    'Package Edited Successfully',
                    'success',
                ).then((e) => {

                })
                getData();
            }).catch(err => {
                setError(true)
                setErrorMsg(err?.response?.data?.message?.[0])
                return

            })
        })





    }
    return (
        <>
            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Package Details</h2>

                <Button className=" mb-3 me-3 " onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Add Package <AddIcon /></Button>


            </div>
            <Modal
                open={billmodalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    <Box style={{ float: "right" }}>
                        <Tooltip style={{ float: 'right', cursor: 'pointer' }} onClick={handleBillModalClose} title="Close">
                            <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
                        </Tooltip>
                    </Box>
                    <Box style={{ width: "fit-content" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
                            Generate Bill For Subscription
                        </Typography>
                    </Box>
                    <Grid container spacing={2} alignItems="center" justify="center">
                        <Grid item xs={12} align="center">
                            <MDBBtn size='medium' style={{ backgroundColor: 'darkcyan' }} onClick={() => generateBill()}>Generate Bill</MDBBtn>
                        </Grid>
                    </Grid>



                </Box>
            </Modal>
            <Modal
                open={submodalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    {
                        error && <Alert variant="danger" onClose={() => setError(false)} dismissible>
                            <p className="text-center" style={{ fontWeight: 'bold' }}>{errorMsg}</p>
                        </Alert>
                    }
                    <Box style={{ float: "right" }}>

                        <Tooltip style={{ float: 'right', cursor: 'pointer' }} onClick={handleSubModalClose} title="Close">
                            <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
                        </Tooltip>

                    </Box>

                    <Box style={{ width: "fit-content" }}>

                        <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
                            Subscribe to this package
                        </Typography>
                    </Box>

                    <Grid container spacing={2} alignItems="center" justify="center">

                        <Grid item xs={6}>
                            <TextField

                                onChange={(e) => setPhone(e.target.value)}
                                variant="standard"
                                required
                                fullWidth
                                name="phone"
                                label="Phone No"
                                type="text"
                                id="phone"
                                value={phone}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <MDBBtn size='medium' style={{ backgroundColor: 'darkcyan' }} onClick={() => getOtp()}>Get Otp</MDBBtn>
                        </Grid>
                        <Grid item xs={6} style={{ display: displayStyle }}>
                            <TextField
                                onChange={(e) => setOtp(e.target.value)}
                                variant="standard"
                                required
                                name="otp"
                                label="Otp Code"
                                type="text"
                                id="otp"
                                value={otp}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ display: displayStyle }}>
                            <MDBBtn size='medium' style={{ backgroundColor: 'darkcyan' }} onClick={() => verifySubs()}>Verify Subscription</MDBBtn>
                        </Grid>
                    </Grid>


                </Box>
            </Modal>
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
                        <Tooltip title="Edit" style={{ float: 'right', cursor: 'pointer' }} onClick={() => handleEdit(currentPackage)}>
                            <IconButton><EditIcon color="success" fontSize="medium" />
                            </IconButton></Tooltip>
                        <Tooltip style={{ float: 'right', cursor: 'pointer' }} title="Delete">
                            <IconButton><DeleteOutlineIcon variant="contained" color="error" onClick={() => handleDelete(currentPackage?.PKPackageId)} fontSize="medium" />
                            </IconButton></Tooltip>
                    </Box>
                    <Box style={{ width: "fit-content" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
                            Package Detail
                        </Typography>
                    </Box>


                    <Grid container spacing={2}>

                        {currentPackage?.PackageName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Package Name</Typography>
                            <Typography style={{ color: "black" }}>{currentPackage?.PackageName}</Typography>
                        </Grid>}
                        {currentPackage?.PackageCost && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Package Cost</Typography>
                            <Typography style={{ color: "black" }}>{currentPackage?.PackageCost}</Typography>

                        </Grid>}

                        {currentPackage?.SubscriptionPeriod && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Subscription Period</Typography>
                            <Typography style={{ color: "black" }}>{currentPackage?.SubscriptionPeriod}</Typography>
                        </Grid>}


                        {currentPackage?.createdAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Creation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentPackage?.createdAt.split("T")[0]}</Typography>
                        </Grid>}

                        {currentPackage?.updatedAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Updation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentPackage?.updatedAt.split("T")[0]}</Typography>
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
                            {!EditModal ? 'Add Package' : 'Edit Package Details'}
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

                                            onChange={(e) => setpackageName(e.target.value)}
                                            variant="standard"
                                            required
                                            fullWidth
                                            name="text"
                                            label="Package Name"
                                            type="text"
                                            id="password"
                                            value={packageName}
                                        />
                                    </Grid>
                                    <Grid item xs={5} className="ms-auto">
                                        <TextField
                                            onChange={(e) => setpackageCost(e.target.value)}
                                            variant="standard"
                                            required
                                            fullWidth
                                            name="text"
                                            label="Package Cost"
                                            type="number"
                                            id="password"
                                            value={packageCost}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            onChange={(e) => setperiod(e.target.value)}
                                            variant="standard"
                                            required
                                            fullWidth
                                            id="period"
                                            label="Subscription Period"
                                            type="text"
                                            placeholder='Subscription period in months'
                                            value={period}
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions className='mx-4 mb-2'>
                            <Button fullWidth onClick={!EditModal ? (e) => { handleSubmit(e) } : (e) => { handleEditSubmit(e) }} variant="contained" style={{ backgroundColor: "darkcyan" }}>
                                {
                                    !EditModal ? 'Add Package' : 'Edit Package Details'
                                }
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <TableContainer className={classes.container} size='small' >
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKPackageID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Package Name</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Package Cost</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Subscription Period</TableCell>
                                <TableCell align="center" colSpan={4} style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>



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
                                                <TableRow hover={true} key={i}>
                                                    <TableCell>{e.PKPackageId}</TableCell>
                                                    <TableCell>{e.PackageName}</TableCell>
                                                    <TableCell>{e.PackageCost}</TableCell>
                                                    <TableCell>{e.SubscriptionPeriod}</TableCell>
                                                    <TableCell><Button variant="outlined" onClick={() => getDetails(e)}>Details</Button></TableCell>
                                                    <TableCell><Button variant="outlined" color="secondary" onClick={() => subscribe(e)}>Subscribe</Button></TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>
                                                        <Tooltip title="Edit" onClick={() => handleEdit(e)}>
                                                            <IconButton><EditIcon color="success" fontSize="medium" />
                                                            </IconButton></Tooltip>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: 'left' }}>
                                                        <Tooltip title="Delete">
                                                            <IconButton><DeleteOutlineIcon variant="contained" color="error" onClick={() => handleDelete(e.PKPackageId)} fontSize="medium" />
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

            </Paper>
        </>
    );
}
