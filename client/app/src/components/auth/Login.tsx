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
import axios from '../../api/axios';
import Alert from '@mui/material/Alert';
import { useNavigate, Link as ReactLink, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LOGIN_URL = '/auth/login';

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

const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = React.useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Enter valid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: any, props: any) => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 500);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      localStorage.setItem('accessToken', response?.data?.token);

      setTimeout(() => {
        setSuccess(true);
        setErrMsg('');
      }, 500);

      navigate('/home', { replace: true });
    } catch (err: any) {
      if (!err?.response) {
        setErrMsg('No response from server');
      } else {
        setErrMsg(err.response.data.message);
      }
    }
  };

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

              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {(props) => (
                  <Form>
                    <Field
                      as={TextField}
                      label="email"
                      name="email"
                      placeholder="Enter email"
                      fullWidth
                      required
                      error={props.errors.email && props.touched.email}
                      helperText={<ErrorMessage name="email" />}
                    />
                    <Field
                      as={TextField}
                      label="password"
                      sx={{ mt: 1, mb: 2 }}
                      name="password"
                      placeholder="Enter password"
                      type="password"
                      fullWidth
                      required
                      error={props.errors.password && props.touched.password}
                      helperText={<ErrorMessage name="password" />}
                    />

                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={!props.touched.password && !props.touched.email ? true : !props.isValid}
                      sx={{ mt: 3, mb: 2 }}
                      fullWidth
                    >
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signup" variant="body2">
                    Don't have a profile? Sign up here.
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export { Login };
