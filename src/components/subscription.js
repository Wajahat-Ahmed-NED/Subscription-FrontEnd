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
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
// import Button from '@mui/material/Button';
// import Button from '@mui/material/Button';
// import { logout } from './dashboard';
import { UserContext } from '../userContext';

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
import { getSubscriptions, getSubscriptionById } from './api/subscriptionApi';
import {apiHandle} from './api/api'



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    overflow:'scroll',
    height:'fit-content',
    display:'block',
    bgcolor: 'background.paper',
    border: '2px solid darkcyan',
    boxShadow: 24,
    p: 4,
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

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [currentSubscription, setcurrentSubscription] = useState(null)
    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [no, setNo] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState('');
    const [refreshToken, setRefreshTokn] = React.useState('');
    const history = useHistory();


    const [openNew, setOpenNew] = React.useState(false);

    const { setToken } = useContext(UserContext);
    // here useeffect will be implemented
    // console.log(rows, "get ALL orders");

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
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(()=>{
        getSubscriptions().then((json) => {
            setData(json.data.data)
            // console.log(json.data.data)
        }).catch((err) => console.log(err))
    })
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        fetchData()
    }, [])

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [cnic, setCnic] = useState('')
    const [EditModal, setEditModal] = useState(false)
    // const [id, setId] = useState(0)
    const [suspend, setSuspend] = useState(0)
    const [tempSuspend, setTempSuspend] = useState(0)
    const [disable, setDisable] = useState(false)
    const [id, setId] = useState('')
    const [filteredData, setFilteredData] = useState([])


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const getDetails = async (e) =>{
        handleModalOpen()
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(()=>{
        getSubscriptionById(e).then((res) => {
            
            
            setcurrentSubscription(res)
            
            // console.log(currentSubscription)
            handleModalOpen()
        }).catch(err => {


            console.log(err, "this error founnd")
        })
    })
    }

    return (
        <>
            {/* <button className='btn btn-primary' onClick={handleUpdate}>Bootstrap</button> */}
            <div className="container d-flex justify-content-between my-0">
                <h1 className='text-center mb-5'> Subscriptions Details</h1>
                {/* <Button className="ms-auto me-3 my-3" onClick={fetchData} size='small' style={{ backgroundColor: 'darkCyan' }} variant="contained">Get Data</Button> */}
                {/* <Button className=" mb-5 me-3 " onClick={handleOpen} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Create user <AddIcon /></Button> */}


            </div>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{mb:3}}>
                    Subscription Detail
                    </Typography>

                    <Grid container spacing={2}>

                        {currentSubscription?.FKCustomerName && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                label="Customer Name"
                                value={currentSubscription?.FKCustomerName}
                            />
                        </Grid>}
                        {currentSubscription?.FKPackageName && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentSubscription?.FKPackageName}
                                label="Package Name"
                            />
                        </Grid>}

                        
                        {currentSubscription?.createdAt && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentSubscription?.createdAt.split("T")[0]}
                                label="Creation Date"
                            />
                        </Grid>}
                        {currentSubscription?.updatedAt && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentSubscription?.updatedAt.split("T")[0]}
                                label="Updation Date"
                            />
                        </Grid>}
                    </Grid>
                </Box>
            </Modal>

            {/* <TextField type="number" id="standard-basic" label="Search By User Id" variant="standard" className='mx-3 mb-5' onChange={(e) => handleTextField(e)} /> */}
            <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                <Backdrop className={classes.backdrop} open={openNew}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <TableContainer className={classes.container} size='small' style={{ maxHeight: '390px', maxWidth: '1078px' }}>
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKSubscriptionID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Customer Name</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Package Name</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                            {

                                data?.[0]?.map((e, i) => {
                                    return (
                                        <>
                                            <TableRow hover={true}>
                                                <TableCell>{e.PKSubscriptionId}</TableCell>
                                                <TableCell>{e.FKCustomerId}</TableCell>
                                                <TableCell>{e.FKPackageId}</TableCell>
                                                <TableCell><Button variant="outlined" onClick={()=>getDetails(e)}>Details</Button></TableCell>
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
        </>
    );
}
