import React, { useEffect, useState, useContext } from 'react';
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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ModalCategory from './Modalcategory';
import Modal from './modal';
import { UserContext } from '../userContext';
import Newmodal from './newmodal';
import Modall from './modal';
import { WebEdit } from './webeditor';
import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { useDispatch, useSelector } from 'react-redux';
import axios, { Axios } from 'axios';

const columns = [
    {
        id: 'PKCategoryID',
        label: 'Category ID',
        minWidth: 80,
    },
    // { id: 'FKCustomerID', label: 'FKCustomerID', minWidth: 100 },
    // {
    //   id: 'FKLabBranchID',
    //   label: 'FKLabBranchID',
    //   minWidth: 100,
    // },
    {
        id: 'Title',
        label: 'Title',
        minWidth: 60,
    },

    {
        id: 'AccessURL',
        label: 'Access URL',
        minWidth: 60,
    },
    {
        id: 'TopText',
        label: 'Top Text',
        minWidth: 60,
    },

    {
        id: 'CreatedDateTime',
        label: 'CreatedDate',
        minWidth: 60
    }, {
        label: 'Description',
        minWidth: 100
    }, {
        label: 'Action',
        minWidth: 60,
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

export default function AllCategories() {

    const classes = useStyles();
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
    };
    const [openNew, setOpenNew] = React.useState(false);


    const { setToken } = useContext(UserContext);


    console.log(rows, "get ALL orders");


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <h1 className='text-center mb-3'> Categories Details</h1>
            <div className="container d-flex justify-content-flex-end">
                <ModalCategory btnTitle="Add" rows={rows} columns={columns} />
            </div>
            <Paper className={classes.root}>
                <Backdrop className={classes.backdrop} open={openNew}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div>
                    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Modal title
                        </DialogTitle>
                        <DialogContent dividers>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            name="text"
                                            label="TEXT"
                                            type="text"
                                            id="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            name="text"
                                            label="TEXT"
                                            type="text"
                                            id="password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose} color="primary">
                                Save changes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }} className={column.label === "Action" && 'text-center'}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    //onClick={handleClickOpen}
                                    <TableRow className="hovereffects" hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {

                                            let value = row[column.id] ? row[column.id] : "N/A";
                                            value = column.id === "CreatedDateTime" && row[column.id] !== null ? row[column.id].slice(0, 10) : value
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value === "Enabled" ? <CheckCircleIcon color="success" /> : column.label === "Action" ? <><ModalCategory btnTitle="Edit" rows={rows} columns={columns} />
                                                        <ModalCategory btnTitle="Delete" /> </> : column.label === "Description" ? <WebEdit /> : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
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
            </Paper></>
    );
}
