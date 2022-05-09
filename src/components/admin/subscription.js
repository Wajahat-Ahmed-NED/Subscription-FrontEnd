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
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import { getSubscriptions, getSubscriptionById } from '../api/subscriptionApi';
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

    console.log(dataFromRedux)

    const classes = useStyles();

    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [currentSubscription, setcurrentSubscription] = useState(null)
    const [page, setPage] = React.useState(0);
    const [rows, setRow] = useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const [nodata, setNodata] = useState(false)
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

    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const fetchData = () => {
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getSubscriptions().then((json) => {
                if (json.data.message[0] == "No subscriptions found" || json.data.data[0].length === 0) {
                    setNodata(true)
                    dispatch({
                        type: 'UPDATESUBSCRIPTIONDATA',
                        subscriptionData: json.data.data
                    })
                }
                else {
                    setNodata(false)
                    setData(json.data.data)
                    dispatch({
                        type: 'UPDATESUBSCRIPTIONDATA',
                        subscriptionData: json.data.data
                    })
                }
            }).catch((err) => console.log(err))
        })
    }

    useEffect(() => {
        let adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")

        if (dataFromRedux?.subscriptionData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.subscriptionData)
        }
    }, [])

    useEffect(() => {
        if (dataFromRedux?.subscriptionData?.length === 0) {
            setNodata(true)
        }
        else {
            setNodata(false)
            setData(dataFromRedux.subscriptionData)
        }
    }, [dataFromRedux?.subscriptionData?.length])
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const getDetails = async (e) => {

        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            getSubscriptionById(e).then((res) => {


                handleModalOpen()
                setcurrentSubscription(res)


            }).catch(err => {


                console.log(err, "this error founnd")
            })
        })
    }

    return (
        <>

            <div className="container d-flex justify-content-between my-0">
                <h2 className='text-center mb-3'> Subscriptions Details</h2>

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
                            Subscription Detail
                        </Typography>
                    </Box>


                    <Grid container spacing={2}>

                        {currentSubscription?.FKCustomerName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Customer Name</Typography>
                            <Typography style={{ color: "black" }}>{currentSubscription?.FKCustomerName}</Typography>
                        </Grid>}

                        {currentSubscription?.FKPackageName && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Package Name</Typography>
                            <Typography style={{ color: "black" }}>{currentSubscription?.FKPackageName}</Typography>
                        </Grid>}


                        {currentSubscription?.createdAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Creation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentSubscription?.createdAt.split("T")[0]}</Typography>
                        </Grid>}

                        {currentSubscription?.updatedAt && <Grid item xs={5}>
                            <Typography style={{ color: "darkcyan" }}>Updation Date</Typography>
                            <Typography style={{ color: "black" }}>{currentSubscription?.updatedAt.split("T")[0]}</Typography>
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

                                <TableCell style={{ textTransform: "capitalize", backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKSubscriptionID</TableCell>
                                <TableCell style={{ textTransform: "capitalize", backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Customer Name</TableCell>
                                <TableCell style={{ textTransform: "capitalize", backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Package Name</TableCell>
                                <TableCell style={{ textTransform: "capitalize", backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>


                            </TableRow>
                        </TableHead>
                        {
                            nodata ? <TableBody>
                                <TableRow>
                                    <TableCell style={{ textTransform: "capitalize" }} colSpan={7} align="center"><Typography> No data in table yet </Typography></TableCell>

                                </TableRow>
                            </TableBody> : <TableBody>
                                {

                                    data?.[0]?.map((e, i) => {
                                        return (
                                            <>
                                                <TableRow hover={true}>
                                                    <TableCell style={{ textTransform: "capitalize" }}>{e.PKSubscriptionId}</TableCell>
                                                    <TableCell style={{ textTransform: "capitalize" }} >{e.customer.FirstName + " " + e.customer.LastName}</TableCell>
                                                    <TableCell style={{ textTransform: "capitalize" }} >{e.package.PackageName}</TableCell>
                                                    <TableCell style={{ textTransform: "capitalize" }}><Button variant="outlined" onClick={() => getDetails(e)}>Details</Button></TableCell>
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
