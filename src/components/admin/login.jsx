import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import './css/login.css'
import { MDBBtn } from 'mdb-react-ui-kit';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useHistory, Link } from "react-router-dom";
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

export default function Login() {

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState(false);
  const [user, setUser] = useState(false);
  const history = useHistory()


  async function logginIn(e) {
    e.preventDefault()
    if(!email || !password)
    {
      setError(true)
      setData('Fill All details')
      return 
    }
    const params = {
      'Username': email,
      'Password': password,
    };
    if (user === 'Admin') {
      await axios.post(`${api}admin/adminSignIn`, params)
        .then(async function (response) {
          if (!response.data.success) {
            setError(true)
            setData(response.data.message[0])
            return
          }
          Swal.fire(
            'Success',
            'Login Successfully',
            'success',
          )
          localStorage.setItem("admin", JSON.stringify(response.data));
          history.push("/dashboard");
          setData(response.data)

        })
        .catch(function (error) {
          setData("Username or Password is incorrect")
          setError(true)
        });

    }
    else if (user == 'User') {
      await axios.post(`${api}user/userSignIn`, params)
        .then(async function (response) {
          if (!response.data.success) {
            setError(true)
            setData(response.data.message[0])
            return
          }
          Swal.fire(
            'Success',
            'Login Successfully',
            'success',
          )
          localStorage.setItem("admin", JSON.stringify(response.data));
          history.push("/userDashboard");
          setData(response.data)

        })
        .catch(function (error) {

          setData("Username or Password is incorrect")
          setError(true)
        });
    } else {
      setError(true)
      setData('Fill All details')
      // Swal.fire(
      //   'Fill All details',
      //   'Cannot Login',
      //   'error',
      // )
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
              Login
            </Typography>
            <form className={classes.form} onSubmit={logginIn} >
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
                    label="UserName"
                    name="email"
                    style={{ borderRadius: '20px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={password}
                    onChange={e => setPasword(e.target.value)}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    style={{ borderRadius: '20px' }}
                  />
                </Grid>
                <Grid item xs={12} container justify="space-between">
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => setUser(e.target.value)}
                  >
                    <FormControlLabel value="Admin" control={<Radio style={{ color: "darkcyan" }} />} label="Admin" />
                    <FormControlLabel value="User" control={<Radio style={{ color: "darkcyan" }} />} label="User" />

                  </RadioGroup>
                </Grid>


              </Grid>
              <Grid container justify="center">

                <div className='d-grid gap-3 col-12 mx-auto my-3'>

                  <MDBBtn size='lg' style={{ backgroundColor: 'darkcyan' }} type="submit">Sign In</MDBBtn>
                </div>
                <div className='d-grid gap-3 col-12 mx-auto my-3' style={{ textAlign: "center" }}>

                  <Link to="/contact">Contact Us</Link>
                </div>
              </Grid>
            </form>

          </div>
        </Box>
      </Container>
    </>
  );
}