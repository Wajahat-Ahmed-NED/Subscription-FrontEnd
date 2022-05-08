import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import './css/login.css'
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, useHistory } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import Swal from 'sweetalert2';
import { isJwtExpired } from 'jwt-check-expiration';
import { api } from '../api/api';

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

export default function ChangePassword({ onClick }) {

    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPasword] = useState('');
    const [newpassword, setnewPasword] = useState('');
    const [retypepassword, setretypePasword] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [renewToken, setRenewToken] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState(false);
    const history = useHistory()


    useEffect(() => {

        var adminToken = localStorage.getItem("admin")
        !adminToken && history.push("/")
        adminToken && setAccessToken(JSON.parse(adminToken)?.data?.[0]?.accessToken)
        adminToken && setRenewToken(JSON.parse(adminToken)?.data?.[0]?.refreshToken)
    }, [])
    accessToken && console.log(isJwtExpired(accessToken))


    async function logginIn(e) {
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
            'PKAdminId': email,
            'oldPassword': password,
            'newPassword': newpassword,
            'retypeNewPassword': retypepassword
        };
        if (isJwtExpired(accessToken)) {
            setError(true)
            setTimeout(() => {

                history.push("/")
            }, 2000);
        }
        else {

            await axios.post(`${api}admin/changePassword`, params,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
                .then(async function (response) {
                    setError(false)

                    Swal.fire(
                        'Success',
                        'Changed Password Successfully',
                        'success',
                    ).then(() => {
                        setData('')
                        setError(false)
                    })
                })
                .catch(function (error) {

                    setError(true)
                    // console.log(error?.response?.data?.message?.[0])
                    setData(error?.response?.data?.message?.[0])
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Could Not Change Passowrd',
                    //     text: 'Something went wrong!',

                    // })
                });
        }
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

                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Admin Change Password
                        </Typography>
                        <form className={classes.form} >
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
                                        label="Admin Id"
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
                            <Grid container justify="center">

                                <div className='d-grid gap-3 col-12 mx-auto my-3'>

                                    <MDBBtn size='lg' style={{ backgroundColor: 'darkcyan' }} onClick={logginIn} >Change Password</MDBBtn>
                                </div>
                            </Grid>
                        </form>
                        <Grid item xs={12}>
                            <Link to="/dashboard">Go Back</Link>
                        </Grid>
                    </div>
                </Box>
            </Container>
        </>
    );
}