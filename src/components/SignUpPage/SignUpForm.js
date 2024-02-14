import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Snackbar, Alert } from "@mui/material";
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
import { useNavigate } from 'react-router-dom';
import {
  emailValidation,
  minLengthValidation,
} from "../../utils/FormValidation";
import { hashPassword } from "../../utils/SecurePass";

const theme = createTheme();

export default function SignUpForm() {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const [formValid, setFormValid] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const [full, setFull] = useState(false);
  const [success, setSuccess] = useState(false);
  const [wrg, setWrg] = useState();
  const navigate = useNavigate();

  const inputValidation = (e) => {
    const { type, name } = e.target;
    switch (type) {
      case "email":
        setFormValid({
          ...formValid,
          [name]: emailValidation(e.target),
        });
        break;
      case "text":
        setFormValid({
          ...formValid,
          [name]: minLengthValidation(e.target, 1),
        });
        break;
      case "password":
        setFormValid({
          ...formValid,
          [name]: minLengthValidation(e.target, 8),
        });
        break;
      default:
        break;
    }
  };
  

  const changeForm = (e) => {
    console.log(inputs);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();
    const { email, password } = formValid;
    const nameVal = inputs.firstName;
    const lastVal = inputs.lastName;
    const emailVal = inputs.email;
    const passVal = inputs.password;
    const repeatpassVal = inputs.repeat_password;

    if (!nameVal || !lastVal || !emailVal || !passVal || !repeatpassVal) {
      setFull(true);
      setWrg("Llene todos los campos!");
    } else {
      if (!email) {
        setFull(true);
        setWrg("Ingrese un correo valido!");
      } else {
        if (!password) {
          setFull(true);
          setWrg("Contraseña minimo 8 caracteres!");
        } else if (passVal !== repeatpassVal) {
          setFull(true);
          setWrg("Las contraseñas no coinciden!");
        } else {
          await hashPassword(passVal).then((hashed) => registerWithSockets(nameVal, lastVal, emailVal, hashed)).finally(
            setTimeout(() => {
              navigate('/');
            }, 5000)
          );
          
        }
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFull(false);
  };

  const registerWithSockets = (nameVal, lastVal, emailVal, hashed) => {
    const ws = new WebSocket("ws://localhost:666/websocket/users");
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          method: "RegisterUser",
          name: nameVal,
          lastname: lastVal,
          email: emailVal,
          password: hashed,
          online: "false"
        }));
      } else {
        console.error("La conexión WebSocket no está abierta aún.");
      }
    };
    ws.onmessage = (event) => {
      setSuccess(true);
      setWrg(event.data);
    };
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registrarse
            </Typography>
            <Box
              component="form"
              onChange={changeForm}
              onSubmit={register}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    fullWidth
                    id="firstName"
                    label="Nombre"
                    type="text"
                    onChange={inputValidation}
                    value={inputs.firstName}
                    inputProps={{ maxLength: 15 }}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label="Apellido"
                    name="lastName"
                    type="text"
                    onChange={inputValidation}
                    value={inputs.lastName}
                    inputProps={{ maxLength: 15 }}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Correo"
                    type="email"
                    name="email"
                    onChange={inputValidation}
                    value={inputs.email}
                    inputProps={{ maxLength: 40 }}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    onChange={inputValidation}
                    value={inputs.password}
                    inputProps={{ maxLength: 20 }}
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="repeat_password"
                    label="Ingrese de nuevo su contraseña"
                    type="password"
                    id="repeat_password"
                    onChange={inputValidation}
                    value={inputs.repeat_password}
                    inputProps={{ maxLength: 20 }}
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Regristrarse
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Tiene una cuenta? Inicie Sesion
                  </Link>
                </Grid>
              </Grid>
            </Box>

            <Snackbar open={full} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} variant="filled" severity="error">
                {" "}
                {wrg}
              </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} variant="filled" severity="success">
                {" "}
                {wrg}
              </Alert>
            </Snackbar>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
