import { useState, useEffect } from "react";
import {
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ErrorInput} from '../../util/ErrorInput'
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from '@mui/material/Backdrop';
import axiosPrivate from '../../api/axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import {useNavigate,useLocation} from 'react-router-dom';


const USER_REGEX: RegExp = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const REGISTER_URL:string = "/auth/register";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [surname, setsurname] = useState("");
  const [validsurname, setvalidsurname] = useState(false);
  const [surnameFocus, setsurnameFocus] = useState(false);

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [birth, setBirth] = React.useState<Dayjs | null>(
    dayjs('2014-08-18'),
  );
  
  const handleBirthChange = (newValue: Dayjs | null) => {
    setBirthCount(true);
    setBirth(newValue);
  };

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [nameCount, setNameCount] = useState(false);
  const [surnameCount, setsurNameCount] = useState(false);
  const [usernameCount, setuserNameCount] = useState(false);
  const [emailCount, setemailCount] = useState(false);
  const [passwordCount, setpasswordCount] = useState(false);
  const [matchCount, setmatchCount] = useState(false);
  const [birthCount, setBirthCount] = useState(false);

  const [open, setOpen] = React.useState(false);


  useEffect(() => {
    setValidUser(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidName(name?.length !== 0);
  }, [name]);

  useEffect(() => {
    setvalidsurname(surname?.length !== 0);
  }, [surname]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd && validPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 500);
    
    try{
      const response = await axiosPrivate.post(REGISTER_URL, 
                JSON.stringify({first_name: name, 
                        last_name: surname, 
                        username: user, 
                        email: email, 
                        password: pwd,
                        date_of_birth: birth})
               );
      localStorage.setItem("accessToken", response?.data?.token);
      setTimeout(() => {
        setSuccess(true);
        setErrMsg("");
      }, 500);
      navigate(from, {replace: true})
    } catch(err:any){
      if(!err?.response){
        setErrMsg('Nema odgovora sa servera');
      } else {
        setErrMsg(err.response.data.error)
      }
    }
  };

  return (
    <>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {success === false && (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              {errMsg && <Alert severity="error">
                            <AlertTitle>Pogreška</AlertTitle>
                                <strong>{errMsg}</strong>
                        </Alert>}
              <Typography component="h1" variant="h5">
                Registracija
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      name="name"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameCount(true);
                      }}
                      onFocus={() => {
                        setNameFocus(true);
                      }}
                      onBlur={() => {
                        setNameFocus(false);
                      }}
                      fullWidth
                      id="name"
                      label="Ime"
                      autoFocus
                      error={ErrorInput(nameCount, validName, nameFocus)}
                      helperText={
                        ErrorInput(nameCount, validName, nameFocus)
                          ? "Ime ne smije biti prazno"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validName ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      required
                      fullWidth
                      id="surName"
                      label="Prezime"
                      name="surName"
                      onChange={(e) => {
                        setsurname(e.target.value);
                        setsurNameCount(true);
                      }}
                      onFocus={() => {
                        setsurnameFocus(true);
                      }}
                      onBlur={() => {
                        setsurnameFocus(false);
                      }}
                      error={ErrorInput(
                        surnameCount,
                        validsurname,
                        surnameFocus
                      )}
                      helperText={
                        ErrorInput(surnameCount, validsurname, surnameFocus)
                          ? "Prezime ne smije biti prazno"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validsurname ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={11}>
                    <TextField
                      inputProps={{ maxLength: 24 }}
                      required
                      fullWidth
                      id="userName"
                      label="Username"
                      name="userName"
                      onChange={(e) => {
                        setUser(e.target.value);
                        setuserNameCount(true);
                      }}
                      onFocus={() => {
                        setUserFocus(true);
                      }}
                      onBlur={() => {
                        setUserFocus(false);
                      }}
                      error={ErrorInput(usernameCount, validUser, userFocus)}
                      helperText={
                        ErrorInput(usernameCount, validUser, userFocus)
                          ? "Username mora biti između 4-24 znaka te" +
                            " započinje velikim ili malim slovom nakon čega slijedi:slova, -, _, brojke"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validUser ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={11}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setemailCount(true);
                      }}
                      onFocus={() => {
                        setEmailFocus(true);
                      }}
                      onBlur={() => {
                        setEmailFocus(false);
                      }}
                      error={ErrorInput(emailCount, validEmail, emailFocus)}
                      helperText={
                        ErrorInput(emailCount, validEmail, emailFocus)
                          ? "Unesite ispravan e-mail."
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validEmail ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={11}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Odaberite datum rođenja"
                      maxDate={dayjs()}
                      inputFormat="MM/DD/YYYY"
                      value={birth}
                      onChange={handleBirthChange}
                      renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                  </LocalizationProvider>

                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={birth && birthCount? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={11}>
                    <TextField
                      inputProps={{ maxLength: 24 }}
                      required
                      fullWidth
                      name="pwd"
                      label="Password"
                      type="password"
                      id="pwd"
                      onChange={(e) => {
                        setPwd(e.target.value);
                        setpasswordCount(true);
                      }}
                      onFocus={() => {
                        setPwdFocus(true);
                      }}
                      onBlur={() => {
                        setPwdFocus(false);
                      }}
                      error={ErrorInput(passwordCount, validPwd, pwdFocus)}
                      helperText={
                        ErrorInput(passwordCount, validPwd, pwdFocus)
                          ? "Lozinka mora biti između 8 i 24 znaka te se sastoji od: " +
                            "barem jednom malog slova, barem jednog velikog slova, barem jedne znamenke te barem jednog specijalnog znaka."
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validPwd ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>

                  <Grid item xs={12} sm={11}>
                    <TextField
                      inputProps={{ maxLength: 24 }}
                      required
                      fullWidth
                      name="matchpassword"
                      label="Confirm password"
                      type="password"
                      id="matchpassword"
                      onChange={(e) => {
                        setMatchPwd(e.target.value);
                        setmatchCount(true);
                      }}
                      onFocus={() => {
                        setMatchFocus(true);
                      }}
                      onBlur={() => {
                        setMatchFocus(false);
                      }}
                      error={ErrorInput(matchCount, validMatch, matchFocus)}
                      helperText={
                        ErrorInput(matchCount, validMatch, matchFocus)
                          ? "Lozinke se ne podudaraju"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validMatch ? "validRegister" : "hide"}
                      size="xl"
                    />
                  </Grid>
                </Grid>
                <Button
                  disabled={
                    !validName ||
                    !validPwd ||
                    !validMatch ||
                    !validUser ||
                    !validEmail ||
                    !validsurname
                      ? true
                      : false
                  }
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registriraj se!
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Već imaš profil? Prijavi se!
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export { Signup };