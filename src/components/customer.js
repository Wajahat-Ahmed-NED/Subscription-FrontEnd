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
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import { UserContext } from '../userContext';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getCustomers, getCustomerById } from './api/customersApi';
import {apiHandle} from './api/api'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    overflow:'scroll',
    height:'90%',
    display:'block',
    bgcolor: 'background.paper',
    border: '2px solid darkcyan',
    boxShadow: 24,
    p: 2,
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
    const handleOpen = () => setOpen(true);
    const dataFromRedux = useSelector((a) => a)
    console.log(dataFromRedux)

    const classes = useStyles();

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
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
    };


    const [openNew, setOpenNew] = React.useState(false);

    const { setToken } = useContext(UserContext);

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
    const fetchData = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(()=>{
            getCustomers().then((json) => {
                setData(json.data.data)
                console.log(json.data.data)
            }).catch((err) => console.log(err))
        })
        
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        fetchData()
    }, [])
    console.log(accessToken)
    const [currentCustomer, setcurrentCustomer] = useState(null)

    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [cnic, setCnic] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [id, setId] = useState('')
    const [id2, setId2] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [filteredData2, setFilteredData2] = useState([])

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleTextField = (e) => {
        setId(e.target.value)
        console.log(e.target.value)

    }
    const handleUserTextField = (e) => {
        setId2(e.target.value)
        console.log(e.target.value)

    }
    console.log(filteredData)

    const getDetails = async (e) =>{
        handleModalOpen()
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(()=>{
        getCustomerById(e).then((res) => {
            
            console.log("response is ", res?.data?.data?.[0])
            setcurrentCustomer(res?.data?.data?.[0])
            // console.log(currentCustomer)
            handleModalOpen()
        }).catch(err => {


            console.log(err, "this error founnd")
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Wrong Credentials or Something went wrong!',

            // })
        })
    })
    }

    return (
        <>

            <div className="container d-flex justify-content-between my-0">
                <h1 className='text-center mb-5'> Customers Details</h1>


            </div>

            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{mb:3}}>
                        Customer Detail
                    </Typography>

                    <Grid container spacing={2}>

                        {currentCustomer?.FirstName && <Grid item xs={5}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                label="First Name"
                                value={currentCustomer?.FirstName}
                            />
                        </Grid>}
                        {currentCustomer?.LastName && <Grid item xs={5} className="ms-auto">
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.LastName}
                                label="Last Name"
                            />
                        </Grid>}

                        {currentCustomer?.Email && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.Email}
                                label="Email Address"
                                
                            />
                        </Grid>}
                        
                        

                        {currentCustomer?.PhoneNumber && <Grid item xs={12}>
                            <TextField
                               disabled
                               fullWidth
                               inputProps={{
                                   style: { color: 'black' }
                               }}
                               InputLabelProps={{
                                style: { color: 'darkcyan' },
                              }}
                               value={currentCustomer?.PhoneNumber}
                                label="Phone No"
                            />
                        </Grid>}
                        {currentCustomer?.CNIC && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.CNIC}
                                label="CNIC No"
                            />
                        </Grid>}
                        {currentCustomer?.Address && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.Address}
                                label="Address"
                            />
                        </Grid>}
                        {currentCustomer?.Country && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.Country}
                                label="Country"
                            />
                        </Grid>}
                        {currentCustomer?.City && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.City}
                                label="City"
                            />
                        </Grid>}
                        {currentCustomer?.Area && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.Area}
                                label="Area"
                            />
                        </Grid>}
                        {currentCustomer?.createdAt && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.createdAt.split("T")[0]}
                                label="Creation Date"
                            />
                        </Grid>}
                        {currentCustomer?.updatedAt && <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                inputProps={{
                                    style: { color: 'black' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'darkcyan' },
                                  }}
                                value={currentCustomer?.updatedAt.split("T")[0]}
                                label="Updation Date"
                            />
                        </Grid>}
                    </Grid>
                </Box>
            </Modal>
            <Paper className={classes.root} style={{ maxWidth: '1100px' }} >
                <Backdrop className={classes.backdrop} open={openNew}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <TableContainer className={classes.container} size='small' style={{ maxHeight: '390px', maxWidth: '1078px' }}>
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
                        <TableBody>
                            {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                            {


                                data?.[0]?.map((e, i) => {
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
