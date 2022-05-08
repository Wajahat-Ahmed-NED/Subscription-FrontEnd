import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import '../admin/css/login.css'
import { MDBBtn } from 'mdb-react-ui-kit';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { Link, useHistory } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import Swal from 'sweetalert2';
import { isJwtExpired } from 'jwt-check-expiration';
import jwt from 'jsonwebtoken'
import { CallToActionSharp } from '@material-ui/icons';
import { apiHandle } from '../api/user/api';
import { passwordChange } from '../api/user/updateUserApi';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(15),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "20px",
        borderRadius: "8px"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'darkcyan',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function UserChangePassword({ onClick }) {

    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPasword] = useState('');
    const [newpassword, setnewPasword] = useState('');
    const [retypepassword, setretypePasword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [renewToken, setRenewToken] = useState('');
    const [adminToken, setadminToken] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState(false);
    const history = useHistory()


    useEffect(() => {

        var adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")
        adminToken && setadminToken(adminToken)
        adminToken && setAccessToken(JSON.parse(adminToken)?.data[0]?.accessToken)
        adminToken && setRenewToken(JSON.parse(adminToken)?.data[0]?.refreshToken)
        console.log(accessToken)
    }, [adminToken])



    async function changePassword(e) {
        e.preventDefault()
        if (!email || !password || !newpassword || !retypepassword) {
            // return Swal.fire(
            //     'Incomplete Details',
            //     'Please Enter All Details',
            //     'error'
            // )
            setError(true)
            setData('Please Enter All Details')
            return
        }
        if(newpassword.length <= 8)
        {
            setError(true)
            setData('Password must be greater than 8')
            return
        }
        if(password.length <= 8)
        {
            setError(true)
            setData('Password must be greater than 8')
            return
        }
        if (newpassword !== retypepassword) {
            setError(true)
            setData('New Password and Retype Password Should Match')
            return
        }
        const params = {
            'PKUserId': email,
            'oldPassword': password,
            'newPassword': newpassword,
            'retypeNewPassword': retypepassword
        };
        let adminToken = localStorage.getItem("admin")
        apiHandle(adminToken).then(() => {
            passwordChange(params).then(async function (response) {

                setError(false)
                setData('')

                Swal.fire(
                    'Success',
                    'Changed Password Successfully',
                    'success',
                )
            })
                .catch(function (error) {
                    setError(true)
                    setData(error?.response?.data?.message[0])
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Could Not Change Password',
                    //     text: 'Something went wrong!',

                    // })
                });
        })

    };


    return (
        <>
            <Container component="main" maxWidth="xs"  >
                <CssBaseline />

                <Box
                    style={{ borderRadius: '20px', backgroundColor: "white" }}
                    boxShadow={15}


                >
                    <div className={classes.paper}>
                        {
                            error && <Alert variant="danger" onClose={() => setError(false)} dismissible>
                                <p className="text-center" style={{ fontWeight: 'bold' }}>{data}</p>
                            </Alert>
                        }
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon color="success" />
                            {/* <LockIcon color="success" /> */}
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            User Change Password
                        </Typography>
                        <form className={classes.form}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        label="User Id"
                                        name="email"
                                        autoComplete="email"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Old Password"
                                        value={password}
                                        onChange={e => setPasword(e.target.value)}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs={12} container justify="space-between">
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Password"
                                        value={newpassword}
                                        onChange={e => setnewPasword(e.target.value)}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Retype New Password"
                                        value={retypepassword}
                                        onChange={e => setretypePasword(e.target.value)}
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center">

                                <div className='d-grid gap-3 col-12 mx-auto my-3'>

                                    <MDBBtn size='lg' style={{ backgroundColor: 'darkcyan' }} onClick={changePassword} >Change Password</MDBBtn>
                                </div>
                            </Grid>
                        </form>
                        <Grid item xs={12}>
                            <Link to="/userDashboard">Go Back</Link>
                        </Grid>
                    </div>
                </Box>
            </Container>
        </>
    );
}