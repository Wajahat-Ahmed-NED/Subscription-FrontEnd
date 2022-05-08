import React, { useState } from 'react';
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
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert'
import Swal from 'sweetalert2';
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

export default function ContactUs({ onClick }) {

    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState(false);


    async function sendMessage(e) {
        e.preventDefault()
        if (phone.length !== 11)
        {
            setError(true)
            setData('Phone Number must be 11 character long')
            return
        }
        const params = {
            'Email': email,
            'Name': name,
            'PhoneNumber': phone,
            'Message': message
        };
        await axios.post(`${api}public/contactUs`, params)
            .then(async function (response) {
                setError(false)
                setData('')
                Swal.fire(
                    'Success',
                    'Message Sent Successfully',
                    'success',
                )
            })
            .catch(function (error) {
                setError(true)
                setData(error?.response?.data?.message)
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Could Not Send Message',
                //     text: 'Something went wrong!',

                // })
            });

    };
    console.log(data)


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
                            Contact Us
                        </Typography>
                        
                        <form className={classes.form} onSubmit={sendMessage} >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="name"
                                        label="Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="text"
                                        id="name"
                                        autoComplete="current-name"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>

                                <Grid item xs={12} container justify="space-between">
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="phone"
                                        label="Phone Number"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        type="text"
                                        id="phone"
                                        autoComplete="phone"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="message"
                                        label="Message"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        type="text"
                                        id="message"
                                        style={{ borderRadius: '20px' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justify="center">

                                <div className='d-grid gap-3 col-12 mx-auto my-3'>

                                    <MDBBtn size='lg' style={{ backgroundColor: 'darkcyan' }} type="submit">Send Message</MDBBtn>
                                </div>
                            </Grid>
                        </form>
                        <Grid item xs={12}>
                            <Link to="/">Go Back</Link>
                        </Grid>
                    </div>
                </Box>
            </Container>
        </>
    );
}