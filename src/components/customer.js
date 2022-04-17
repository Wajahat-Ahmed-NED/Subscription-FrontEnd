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
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from "react-router-dom";
import { UserContext } from '../userContext';

import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getCustomers } from './api/customersApi';


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
                getCustomers().then((json) => {
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

        return (
                <>

                        <div className="container d-flex justify-content-between my-0">
                                <h1 className='text-center mb-5'> Customers Details</h1>


                        </div>
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




                                                        </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                                                        {


                                                                data?.[0]?.map((e, i) => {
                                                                        return (
                                                                                <>
                                                                                        <TableRow hover={true}>
                                                                                                <TableCell>{e.PKCustomerID}</TableCell>
                                                                                                <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                                                                <TableCell>{e.Email}</TableCell>
                                                                                                <TableCell>{e.PhoneNumber}</TableCell>
                                                                                                <TableCell>{e.CNIC}</TableCell>
                                                                                                <TableCell>{e.Address}</TableCell>
                                                                                                <TableCell>{e.Country}</TableCell>
                                                                                                <TableCell>{e.City}</TableCell>
                                                                                                <TableCell>{e.Area}</TableCell>

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
                                <h1 className='text-center mb-5'> Search By CustomerID</h1>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-standard-label">Customer ID</InputLabel>
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
                                                        data[0]?.map((e, i) => <MenuItem value={e.PKCustomerId}>{e.PKCustomerId}</MenuItem>)
                                                }

                                        </Select>
                                </FormControl>
                                <Button className=" mb-5 me-3 " onClick={() => setFilteredData(data[0]?.filter((ev) => ev.PKCustomerId === id))} size='sm' style={{ backgroundColor: 'darkCyan', fontSize: "bolder" }} variant="contained">Search <SearchIcon /></Button>


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
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PKCustomerID</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Name</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Email</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>PhoneNumber</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>CNIC</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Address</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Country</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>City</TableCell>
                                                                        <TableCell style={{ backgroundColor: 'darkcyan', color: 'white', fontSize: '20px' }}>Area</TableCell>


                                                                </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                                {/* /* {isJwtExpired && rows && Array.isArray(rows) && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                                                                {

                                                                        filteredData?.map((e, i) => {
                                                                                return (
                                                                                        <>
                                                                                                <TableRow hover={true}>
                                                                                                        <TableCell>{e.PKCustomerID}</TableCell>
                                                                                                        <TableCell>{e.FirstName + " " + e.LastName}</TableCell>
                                                                                                        <TableCell>{e.Email}</TableCell>
                                                                                                        <TableCell>{e.PhoneNumber}</TableCell>
                                                                                                        <TableCell>{e.CNIC}</TableCell>
                                                                                                        <TableCell>{e.Address}</TableCell>
                                                                                                        <TableCell>{e.Country}</TableCell>
                                                                                                        <TableCell>{e.City}</TableCell>
                                                                                                        <TableCell>{e.Area}</TableCell>

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
