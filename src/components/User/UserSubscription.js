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
import Alert  from 'react-bootstrap/Alert';

import { apiHandle } from '../api/api';
import { getSubscription, getSubscriptionByPkgId, updateSubscription } from '../api/user/userSubscriptionApi';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const columns = [
    {
        id: 'PKOrderID',
        label: 'OrderID',
        minWidth: 60,
    },
    // { id: 'FKCustomerID', label: 'FKCustomerID', minWidth: 100 },
    // {
    //   id: 'FKLabBranchID',
    //   label: 'FKLabBranchID',
    //   minWidth: 100,
    // },
    {
        id: 'Notes',
        label: 'Notes',
        minWidth: 60,
    },

    {
        id: 'Total',
        label: 'Total',
        minWidth: 60,
    },

    {
        id: 'CreatedDateTime',
        label: 'Created Date',
        minWidth: 60
    }, {
        label: 'Description',
        minWidth: 100
    },
    {
        label: 'Action',
        minWidth: 60
    },
    {
        id: 'Status',
        label: 'Status',
        minWidth: 50,
    }
];

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

export default function UserSubscription() {
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
    const [nodata, setNodata] = useState(false)


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
        setError(false);
        setErrorMsg('');
        setPackageId('')
        setCustomerId('')
    };

    // const accessToken = '';
    // const refreshToken;



    const handleSubmit = async (e) => {
        e.preventDefault()
    }

    const [openNew, setOpenNew] = React.useState(false);
    const [error, setError] = React.useState(false);

    // const { setToken } = useContext(UserContext);
    // here useeffect will be implemente

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
        apiHandle(adminToken).then(()=>{
            getSubscription().then(json => {
                if(json?.data?.data?.[0].length === 0)
                {
                    setNodata(true)
                }
                else
                {
                    setNodata(false)
                    setData(json?.data?.data?.[0])
                }

            })
            .catch(err => {
                console.log(err)
            })
        })
            
    }
    const getDataByPkg = async () => {
        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(()=>{
            getSubscriptionByPkgId(pkgId).then(json => {
                if(json.data.message[0] == "No subscriptions of current package id found" || json?.data?.data?.length === 0)
                {
                    setNodata(true)
                }
                else
                {
                    setNodata(false)
                    setData(json?.data?.data)
                }
                
            })
            .catch(err => {
                console.log(err)
            })
        })
            
    }
    useEffect(() => {
        getData()
        var adminToken = localStorage.getItem("admin")
        adminToken && setAccessToken(JSON.parse(adminToken)?.data?.data?.[0]?.accessToken)
    }, [])
    // console.log(accessToken)
    const [errorMsg, setErrorMsg] = useState('')

    const [PackageId, setPackageId] = useState('')
    const [CustomerId, setCustomerId] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [id, setId] = useState(0)
    const [pkgId, setPkgId] = React.useState(null);
    const [disable, setDisable] = useState(false)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const handleEdit = async (e) => {
        // e.preventDefault()

        setEditModal(e)
        setPackageId(e.FKPackageId)
        setCustomerId(e.FKCustomerId)
        // setCnic(e.Email)
        // setUser(e.user)
        // console.log(e)
        setOpen(true);
        setId(e.PKSubscriptionId)




    }

    const handleEditSubmit = async (e) => {
        let obj = {
            FKPackageId: PackageId,
        }
        let adminToken = localStorage.getItem('admin')
        apiHandle(adminToken).then(()=>{
            updateSubscription(id,obj).then(function (response) {

                setOpen(false);
                setError(false)
                setErrorMsg('')
                setEditModal(null)
                setPackageId('')
                setCustomerId('')
                Swal.fire(
                    'Success',
                    'Subscription Edited Successfully',
                    'success',
                )
                getData();
            }).catch(err => {
                setOpen(false);
                setError(true)
                setErrorMsg(err?.response?.data?.message[0])
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
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
                <h2 className='text-center mb-3'> Subscription Details</h2>
                <div style={{ float: 'right' }}>
                <Grid container >
                     <Grid item xs={8}>
                        <input placeholder='Subscription by Package ID' type='number' style={{ height: '33px', outline: 'none', width:"215px" }}
                            onChange={(e) => setPkgId(e.target.value)} />
                    </Grid>
                    <Grid item xs={1}>
                        <Button className=" mb-4 ms-3 " onClick={() => getDataByPkg()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

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
                            {!EditModal ? 'Create Subscription' : 'Edit Subscription Details'}
                        </DialogTitle>
                        <DialogContent dividers className='mx-3'>
                        {
                    error && <Alert variant="danger" onClose={() => setError(false)} dismissible>
                        <p className="text-center" style={{ fontWeight: 'bold' }}>{errorMsg}</p>
                    </Alert>
                }
                            <form className={classes.form} noValidate>
                                <Grid container spacing={2}>

                                    
                                    <Grid item xs={12} className="ms-auto">
                                        <TextField
                                            onChange={(e) => setCustomerId(e.target.value)}
                                            variant="standard"
                                            disabled
                                            inputProps={{
                                                style: { color: 'gray' }
                                            }}
                                            fullWidth
                                            name="text"
                                            label="Customer Id"
                                            type="text"
                                            id="password"
                                            value={CustomerId}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField

                                            onChange={(e) => setPackageId(e.target.value)}
                                            variant="standard"
                                            required
                                            fullWidth
                                            name="text"
                                            label="Package Id"
                                            type="text"
                                            id="password"
                                            value={PackageId}
                                        />
                                    </Grid>
                                    
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions className='mx-4 mb-2'>
                            <Button fullWidth onClick={!EditModal ? (e) => { handleSubmit(e) } : (e) => { handleEditSubmit(e) }} variant="contained" style={{ backgroundColor: "darkcyan" }}>
                                {

                                    !EditModal ? 'Create Subscription' : 'Edit Subscription Details'
                                }
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <TableContainer className={classes.container} size='small' style={{ maxHeight: '670px', maxWidth: '1078px' }}>
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell align="center" style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKSubscriptionID</TableCell>
                                <TableCell align="center" style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>FKCustomerID</TableCell>
                                <TableCell align="center" style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>FKPackageID</TableCell>
                                <TableCell align="center" cellSpan={2} style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>



                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} align="center"><Typography> No data in table yet </Typography></TableCell>
                            
                            </TableRow>
                            </TableBody> :<TableBody>
                            {
                                data?.map((e, i) => {
                                    return (
                                        <>
                                            <TableRow hover={true}>
                                                <TableCell>{e?.subscriptions?.[0].PKSubscriptionId}</TableCell>
                                                <TableCell>{e?.subscriptions?.[0].FKCustomerId}</TableCell>
                                                <TableCell>{e?.subscriptions?.[0].FKPackageId}</TableCell>
                                                <TableCell style={{ textAlign: 'left' }}>
                                                    <Tooltip title="Edit" onClick={() => handleEdit(e?.subscriptions?.[0])}>
                                                        <IconButton><EditIcon color="success" fontSize="medium" />
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
