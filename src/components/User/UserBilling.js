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
import { MDBBtn } from 'mdb-react-ui-kit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Alert from 'react-bootstrap/Alert';

import { apiHandle } from '../api/api';
import { billUpdation, getSubscription, getSubscriptionByPkgId, updateSubscription } from '../api/user/userSubscriptionApi';
import { billGeneration, getBillBySubscriptionId } from '../api/user/userBillingApi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pb: 4,
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

export default function UserBilling() {

  const handleOpen = () => setOpen(true);

  const dataFromRedux = useSelector((a) => a)

  const classes = useStyles();
  const [nodata, setNodata] = useState(false)


  const [page, setPage] = React.useState(0);
  const [rows, setRow] = useState([]);
  const [billId, setBillId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState('');
  const [submodalOpen, setSubModalOpen] = React.useState(false);
  const handleSubModalOpen = () => setSubModalOpen(true);
  const handleSubModalClose = () => setSubModalOpen(false);
  const handleClose = () => {
    setOpen(false);
    setEditModal(null)
    setError(false);
    setErrorMsg('');
    setPackageId('')
    setCustomerId('')
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
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

  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [billdata, setBillData] = useState([])
  const getData = async () => {
    let adminToken = localStorage.getItem('admin')
    apiHandle(adminToken).then(() => {
      getSubscription().then(json => {
        if (json?.data?.data?.length === 0) {
          setNodata(true)
          dispatch({
            type: 'UPDATESUBSCRIPTIONDATA',
            subscriptionData: json.data.data?.[0],
            billingData: json.data.data?.[1][0]
          })
        }
        else {
          setNodata(false)
          setData(json?.data?.data?.[0])
          setBillData(json?.data?.data?.[1][0])
          dispatch({
            type: 'UPDATESUBSCRIPTIONDATA',
            subscriptionData: json.data.data?.[0],
            billingData: json.data.data?.[1][0],
          })
        }

      })
        .catch(err => {
          console.log(err)
        })
    })

  }
  const getDataBySubs = async () => {
    let adminToken = localStorage.getItem('admin')
    apiHandle(adminToken).then(() => {
      getBillBySubscriptionId(subsId).then(json => {
        if (json.data.message[0] == "No subscription of current user packages found" || json.data.message[0] == "No bills of current subscription found" || json?.data?.data?.length === 0) {
          setNodata(true)

        }
        else {
          console.log("Data get is ", json?.data?.data?.[0])

          setNodata(false)
          setBillData(json?.data?.data?.[0])

        }

      })
        .catch(err => {
          Swal.fire(
            "Could Not Found Bill",
            "Subscription ID Does Not Exist!", "error"
          )
          console.log(err)
        })
        .catch(err => {
          Swal.fire(
            "Can not search", "Invalid ID or something went wrong", "error"
          )
          console.log(err?.response)
        })
    })

  }
  useEffect(() => {

    var adminToken = localStorage.getItem("admin")
    adminToken && setAccessToken(JSON.parse(adminToken)?.data?.data?.[0]?.accessToken)
    if (dataFromRedux?.subscriptionData?.length === 0) {
      setNodata(true)
    }
    else {
      setNodata(false)
      setData(dataFromRedux.subscriptionData)
      setBillData(dataFromRedux.billingData)
    }
  }, [])

  useEffect(() => {
    if (dataFromRedux?.subscriptionData?.length === 0) {
      setNodata(true)
    }
    else {
      setNodata(false)
      setData(dataFromRedux.subscriptionData)
      setBillData(dataFromRedux.billingData)
    }
  }, [dataFromRedux?.subscriptionData?.length])
  const [errorMsg, setErrorMsg] = useState('')

  const [PackageId, setPackageId] = useState('')
  const [CustomerId, setCustomerId] = useState('')
  const [EditModal, setEditModal] = useState(false)
  const [id, setId] = useState(0)
  const [subsId, setSubsId] = React.useState(null);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(()=>{
    if(dataFromRedux.subsId)
    {
      setSubsId(dataFromRedux.subsId)
    }
  },[])

  useEffect(()=>{
    if(dataFromRedux.subsId && subsId !== null)
    {
      getDataBySubs();
      dispatch({
        type: "UPDATESUBSCRIPTIONID",
        subsId: undefined
    })
    }
  },[subsId])

  const updateBill = async (e) => {
    setBillId(e?.PKBillId);
    setSubModalOpen(true);
  }


  const handleUpdateBill = async () => {
    if (!amount) {
      // handleSubModalClose()
      // return Swal.fire(
      //   'Incomplete Details',
      //   'Please Enter Amount',
      //   'error'
      // ).then(() => {
      //   handleSubModalOpen()

      // })
      setError(true)
      setErrorMsg('Please Enter Amount')
      return
    }
    let obj = {
      ReceivedAmount: parseInt(amount),
    }
    let adminToken = localStorage.getItem('admin')
    apiHandle(adminToken).then(() => {
      billUpdation(billId, obj).then((res) => {
        setAmount(0)
        handleSubModalClose()
        if (res?.data?.message) {
          // Swal.fire(
          //   'Already Paid',
          //   res?.data?.message?.[0],
          //   'success',
          // )
          setError(true)
          setErrorMsg('Bill Already Paid')
        }
        else {
          setError(false)
          Swal.fire(
            'Success',
            'Bill Updated Successfully',
            'success',
          )
        }
        getData();
      }).catch(err => {
        // handleSubModalClose()
        // Swal.fire(
        //   'Could Not Update Bill',
        //   err?.response?.data?.message?.[0],
        //   'error',
        // ).then(() => {
        //   handleSubModalOpen()
        // })
        setError(true)
        setErrorMsg(err?.response?.data?.message?.[0])
      })
    })
  }


  const handleEditSubmit = async (e) => {
    if (!PackageId) {
      setOpen(false);
      return Swal.fire(
        'Incomplete Details',
        'Please Enter Package Id',
        'error'
      ).then(() => {
        setOpen(true)
      })
    }
    let obj = {
      FKPackageId: PackageId,
    }
    let adminToken = localStorage.getItem('admin')
    apiHandle(adminToken).then(() => {
      updateSubscription(id, obj).then(function (response) {

        setOpen(false);
        setError(false)
        setErrorMsg('')
        setEditModal(null)
        setPackageId('')
        setCustomerId('')
        setError(false)

        Swal.fire(
          'Success',
          'Subscription Edited Successfully',
          'success',
        )
        getData();
      }).catch(err => {
        setOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Could Not Edit Subscription',
          text: err?.response?.data?.message[0],

        }).then((e) => {

          setOpen(true);

        })
      })

    })
  }
  return (
    <>
      <div className="container d-flex justify-content-between my-0 me-0">
        <h2 className='text-center mb-3'> Billing Details</h2>
        <div>
          <Grid container >
            <Grid item xs={7}>
              <input className="me-2" placeholder='Bill by Subscription ID' type='number' style={{ height: '33px', outline: 'none', width: "215px" }}
                onChange={(e) => setSubsId(e.target.value)} />
            </Grid>
            <Grid item xs={5}>
              <Button className="ms-4 me-0" onClick={() => getDataBySubs()} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search </Button>

            </Grid>
          </Grid>
        </div>

      </div>

      <Modal
        open={submodalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          {
            error && <Alert variant="danger" style={{ "marginTop": 4 }} onClose={() => setError(false)} dismissible>
              <p className="text-center" style={{ fontWeight: 'bold' }}>{errorMsg}</p>
            </Alert>
          }
          <Box style={{ width: "100%", float: "right" }}>
            <Tooltip style={{ float: 'right', cursor: 'pointer' }} onClick={handleSubModalClose} title="Close">
              <IconButton><CloseIcon style={{ float: 'right', cursor: 'pointer' }} fontSize="medium" /></IconButton>
            </Tooltip>
          </Box>
          <Box style={{ width: "fit-content" }}>
            <Typography id="modal-modal-title" variant="h6" component="h3" align="center" sx={{ mb: 3 }}>
              Update Billing
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" justify="center">

            <Grid item xs={6}>
              <TextField

                onChange={(e) => setAmount(e.target.value)}
                variant="standard"
                required
                fullWidth
                name="amount"
                label="Received Amount"
                type="number"
                id="amount"
                value={amount}
              />
            </Grid>
            <Grid item xs={5}>
              <MDBBtn size='medium' style={{ backgroundColor: 'darkcyan' }} onClick={() => handleUpdateBill()}>Update Bill</MDBBtn>
            </Grid>
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

                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKBillID</TableCell>
                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>FKSubscriptionID</TableCell>
                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Net Amount</TableCell>
                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Recieved Amount</TableCell>
                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Discount</TableCell>
                <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Status</TableCell>
                <TableCell align="center" colSpan={2} style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Action</TableCell>



              </TableRow>
            </TableHead>
            {
              nodata ? <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center"><Typography> No data in table yet </Typography></TableCell>

                </TableRow>
              </TableBody> : <TableBody>
                {
                  billdata?.map((e, i) => {
                    return (
                      <>
                        <TableRow hover={true}>
                          <TableCell>{e?.PKBillId}</TableCell>
                          <TableCell>{e?.FKSubscriptionId}</TableCell>
                          <TableCell>{e?.NetAmount}</TableCell>
                          <TableCell>{e?.ReceivedAmount}</TableCell>
                          <TableCell>{e?.Discount}</TableCell>
                          <TableCell>{e?.PaymentStatus}</TableCell>
                          <TableCell>
                            {e?.PaymentStatus === "fully_paid" ? <Typography style={{ width: 'max-content', color: "green" }}>Already Paid </Typography> : <Button variant="outlined" onClick={() => updateBill(e)}>Update Bill</Button>}
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
