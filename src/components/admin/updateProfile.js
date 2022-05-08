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
import './css/login.css'
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, useHistory } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import Swal from 'sweetalert2';
import { apiHandle } from '../api/api';
import { profileUpdate } from '../api/adminApi';

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

export default function UpdateProfile({ onClick }) {

    const classes = useStyles();
    const [firstName, setFname] = useState('');
    const [lastName, setLname] = useState('');
    const [phone, setPhone] = useState('');
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



    async function updateProfile(e) {
        e.preventDefault()
        if (!firstName || !lastName || !phone) {
            setError(true)
            setData('Please enter all details')
            return
        }
        if (phone.length !== 11) {
            setError(true)
            setData('Phone number must be 11 characters long')
            return
        }
        const params = {

            'FirstName': firstName,
            'LastName': lastName,
            'PhoneNumber': phone
        };
        apiHandle(adminToken).then(() => {
            profileUpdate(params).then(async function (response) {

                setError(false)
                setData('')

                Swal.fire(
                    'Success',
                    'Profile Updated Successfully',
                    'success',
                )
            })
                .catch(function (error) {
                    setError(true)
                    setData(error?.response?.data?.message[0])
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'Could Not Update Profile',
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

                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Update Admin Profile
                        </Typography>
                        <form className={classes.form} >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={e => setFname(e.target.value)}
                                        label="First Name"
                                        name="firstName"
                                        autoComplete="text"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        name="lastName"
                                        label="Last Name"
                                        value={lastName}
                                        onChange={e => setLname(e.target.value)}
                                        type="text"
                                        id="lastName"
                                        autoComplete="text"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        fullWidth
                                        name="phone"
                                        label="Phone No (0300-XXXXXXX)"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        type="number"
                                        id="phone"
                                        autoComplete="phoneNumber"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>

                            </Grid>
                            <Grid container justifyContent="center">

                                <div className='d-grid gap-3 col-12 mx-auto my-3'>

                                    <MDBBtn size='lg' style={{ backgroundColor: 'darkcyan' }} onClick={updateProfile} >Update Profile</MDBBtn>
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