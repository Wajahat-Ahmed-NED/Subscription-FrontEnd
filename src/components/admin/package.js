import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Modal from '@mui/material/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getPackages, getPackageById, getPackageByUserId } from '../api/packageApi';
import { apiHandle } from '../api/api'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450',
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


export default function ContactPage() {

    const handleOpen = () => setOpen(true);

    const dataFromRedux = useSelector((a) => a)

    const classes = useStyles();

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [currentPackage, setcurrentPackage] = useState(null)
    const [nodata, setNodata] = useState(false)

    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
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

    const fetchData = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getPackages().then((json) => {
                if (json.data.message[0] == "No packages found" || json.data.data[0].length === 0) {
                    setNodata(true)
                }
                else {
                    setNodata(false)
                    setData(json.data.data[0])
                }
            }).catch((err) => console.log(err))
        })
    }
    const dispatch = useDispatch()
    const getDataByUser = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getPackageByUserId(userId).then((json) => {
                console.log(json)
                if (json.data.data[0].length === 0) {
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
            }).catch((err) => {
                Swal.fire(
                    "Could Not Found Package",
                    "User ID Does Not Exist!",
                    "error"
                )
            }
            )
        })
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

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
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [EditModal, setEditModal] = useState(false)
    const [id, setId] = useState('')
    const [id2, setId2] = useState('')
    const [userId, setUserId] = React.useState(null);



    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getDetails = async (e) => {

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getPackageById(e).then((res) => {

                handleModalOpen()
                setcurrentPackage(res?.data?.data?.[0])
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
    const handleTextField = (e) => {
        setId(e.target.value)


    }
    const handleUserTextField = (e) => {
        setId2(e.target.value)

    }


    return (
        <>

            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Packages Details</h2>
                <div style={{ float: 'right' }}>
                    <Grid container  >
                        <Grid item xs={7}>
                            <input placeholder='Package By User ID' onChange={(e) => setUserId(e.target.value)} type='number' style={{ height: '33px', outline: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button className="ms-3 " onClick={() => getDataByUser()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

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
                        <Tooltip style={{ float: "right", cursor: 'pointer' }} onClick={handleModalClose} title="Close">
                            <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
                        </Tooltip>
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

                <TableContainer className={classes.container} size='small'  >
                    <Table stickyHeader aria-label="sticky table" size='small' >
                        <TableHead>
                            <TableRow>

                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKPackageID</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PackageName</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PackageCost</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>SubscriptionPeriod</TableCell>
                                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>




                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7} align="center"><Typography> No data in table yet </Typography></TableCell>

                                </TableRow>
                            </TableBody> : <TableBody>
                                {


                                    data?.map((e, i) => {
                                        return (
                                            <>
                                                <TableRow hover={true}>
                                                    <TableCell>{e.PKPackageId}</TableCell>
                                                    <TableCell>{e.PackageName}</TableCell>
                                                    <TableCell>{e.PackageCost}</TableCell>
                                                    <TableCell>{e.SubscriptionPeriod}</TableCell>
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
