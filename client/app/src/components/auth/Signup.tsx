import { useState } from 'react';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import axiosPrivate from '../../api/axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

const REGISTER_URL: string = '/auth/register';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http:/localhost:3000/aboutUs">
        Projekt
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});

export default function Signup() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Name too short.').required('Required'),
    lastName: Yup.string().min(3, 'Last name too short.').required('Required'),
    userName: Yup.string().min(6, 'Username too short').required('Required'),
    email: Yup.string().email('Enter valid email').required('Required'),
    password: Yup.string()
      .min(8, 'Password minimum length should be 8')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, number and special character',
      )
      .required('Required'),
    matchPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Password not matched')
      .required('Required'),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [birth, setBirth] = React.useState<Dayjs | null>(dayjs('2014-08-18'));

  const handleBirthChange = (newValue: Dayjs | null) => {
    setBirth(newValue);
  };

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      matchPassword: '',
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 500);

      try {
        const response = await axiosPrivate.post(
          REGISTER_URL,
          JSON.stringify({
            first_name: values.name,
            last_name: values.lastName,
            username: values.userName,
            email: values.email,
            password: values.password,
            date_of_birth: birth,
          }),
        );
        localStorage.setItem('accessToken', response?.data?.token);
        setTimeout(() => {
          setSuccess(true);
          setErrMsg('');
        }, 500);
        navigate('/home', { replace: true });
      } catch (err: any) {
        if (!err?.response) {
          setErrMsg('Nema odgovora sa servera');
        } else {
          setErrMsg(err.response.data.message);
        }
      }
    },
  });

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {success === false && (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              {errMsg && (
                <Alert severity="error">
                  <strong>Error </strong> {errMsg}
                </Alert>
              )}
              <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                Sign up
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.name) && formik.touched.name}
                      helperText={formik.errors.name && formik.touched.name ? formik.errors.name : ''}
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="First name"
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.lastName) && formik.touched.lastName}
                      helperText={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : ''}
                      name="lastName"
                      required
                      fullWidth
                      id="lastName"
                      label="Last name"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.userName) && formik.touched.userName}
                      helperText={formik.errors.userName && formik.touched.userName ? formik.errors.userName : ''}
                      name="userName"
                      required
                      fullWidth
                      id="userName"
                      label="Username"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.email) && formik.touched.email}
                      helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
                      name="email"
                      required
                      fullWidth
                      id="email"
                      label="Email"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Choose your birthdate"
                        maxDate={dayjs()}
                        inputFormat="MM/DD/YYYY"
                        value={birth}
                        onChange={handleBirthChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      inputProps={{ maxLength: 24 }}
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.password) && formik.touched.password}
                      helperText={formik.errors.password && formik.touched.password ? formik.errors.password : ''}
                      name="password"
                      required
                      fullWidth
                      id="password"
                      label="Password"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      inputProps={{ maxLength: 24 }}
                      type="password"
                      value={formik.values.matchPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={Boolean(formik.errors.matchPassword) && formik.touched.matchPassword}
                      helperText={
                        formik.errors.matchPassword && formik.touched.matchPassword ? formik.errors.matchPassword : ''
                      }
                      name="matchPassword"
                      required
                      fullWidth
                      id="matchPassword"
                      label="Confirm Password"
                    />
                  </Grid>
                </Grid>
                <Button
                  disabled={
                    !formik.touched.name &&
                    !formik.touched.lastName &&
                    !formik.touched.email &&
                    !formik.touched.userName &&
                    !formik.touched.password &&
                    !formik.touched.matchPassword
                      ? true
                      : !formik.isValid
                  }
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign up!
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have a profile? Login here.
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export { Signup };
