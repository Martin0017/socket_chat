import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import PublicIcon from "@mui/icons-material/Public";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LogoutIcon from "@mui/icons-material/Logout";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Snackbar, Alert } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socket2, setSocket2] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [full, setFull] = useState(false);
  const [wrg, setWrg] = useState();

  const [inputs, setInputs] = useState({
    email: "",
    message: "",
    room: "1"
  });



  const changeForm = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFull(false);
  };

  const goToRoom = () => {
      if(inputs.room == "1"){
        navigate("/roomone");
        window.location.reload();
      }else if(inputs.room == "2"){
        navigate("/roomtwo");
        window.location.reload();
      }else if(inputs.room == "3"){
        navigate("/roomthree");
        window.location.reload();
      }
  }

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputs.email === window.localStorage.getItem("user")) {
      setFull(true);
      setWrg("No se puede enviar un email a si mismo");
    } else {
      socket2.send(
        JSON.stringify({
          method: "RegisterPrivateMessage",
          emailSend: window.localStorage.getItem("user"),
          emailReceived: inputs.email,
          messageSend: inputs.message
        })
      );
      handleClose();
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:666/websocket/getusers");
    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to WebSocket server", "message");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            method: "GetUsers",
          })
        );
      } else {
        console.error("La conexión WebSocket no está abierta aún.");
      }
    };

    ws.onmessage = (event) => {
      const datosParse = JSON.parse(event.data);
      setUsers(datosParse.data);
    };

    const ws2 = new WebSocket("ws://localhost:666/websocket/privatemessages");
    setSocket2(ws2);
    ws2.onopen = () => {
      console.log("Connected to WebSocket server", "message");
      if (ws2.readyState === WebSocket.OPEN) {
        ws2.send(
          JSON.stringify({
            method: "GetPrivateMessages",
          })
        );
      } else {
        console.error("La conexión WebSocket no está abierta aún.");
      }
    };

    ws2.onmessage = (event) => {
      const datosParse = JSON.parse(event.data);
      const arrayRevertido = [...datosParse.data].reverse();
      setPrivateMessages(arrayRevertido);
    };

    return () => {};
  }, []);

  const logout = () => {
    socket.send(
      JSON.stringify({
        method: "Logout",
        email: window.localStorage.getItem("user"),
      })
    );
    navigate("/");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      <Grid container sx={{ backgroundColor: "#6B6465" }}>
        <Grid item xs={6}>
          <Box
            sx={{ height: "100vh", width: "100vh", backgroundColor: "#282223" }}
          >
            <Item
              sx={{
                height: "10vh",
                width: "100vh",
                backgroundColor: "#282223",
                fontSize: 40,
                color: "white",
              }}
            >
              {" "}
              Usuarios Disponibles{" "}
            </Item>
            <List
              sx={{
                width: "100vh",
                background:
                  "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJGTI4jj6WEf3-64eM0mDln5K1X-XRbZHHpg&usqp=CAU)",
                position: "relative",
                overflow: "auto",
                height: "80vh",
                "& ul": { padding: 0 },
              }}
            >
              {users.map((item) =>
                item[3] === "1" ? (
                  <ListItem
                    key={`item--${item}`}
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    {`${item[0]} ${item[1]} se encuentra conectado`}
                    <br />
                    <MailOutlineIcon />: {item[2]}
                  </ListItem>
                ) : (
                  <ListItem
                    key={`item--${item}`}
                    style={{ backgroundColor: "#973541", color: "white" }}
                  >
                    {`${item[0]} ${item[1]} se encuentra desconectado.`}
                    <br />
                    <MailOutlineIcon />: {item[2]}
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Grid>
        <Grid item xs sx={{ backgroundColor: "#6B6465" }}>
        <Box
            sx={{ height: "10vh", width: "100vh", backgroundColor: "#6B6465" }}
          ></Box>
          <Box
            sx={{ height: "10vh", width: "100vh", backgroundColor: "#6B6465" }}
          >
            <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={{color: "whitesmoke", textAlign: "center"}}>Salas</InputLabel>
        <Select
          labelId="idLabelRoom"
          id="idRoom"
          name="room"
          defaultValue={"1"}
          value={inputs.room}
          label="Sala"
          onChange={changeForm}
          sx={{backgroundColor: "black", color: "whitesmoke", textAlign: "center"}}
        >
          <MenuItem value={"1"}>Sala 1</MenuItem>
          <MenuItem value={"2"}>Sala 2</MenuItem>
          <MenuItem value={"3"}>Sala 3</MenuItem>
        </Select>
      </FormControl>
          </Box>
          <Box
            sx={{ height: "30vh", width: "100vh", backgroundColor: "#6B6465" }}
          >
            <Grid>
              <Grid
                item
                xs={14}
                sx={{
                  height: "10vh",
                  width: "100vh",
                  backgroundColor: "#6B6465",
                }}
              >
                {" "}
                <Button
                  variant="contained"
                  sx={{
                    height: "10vh",
                    width: "100vh",
                    backgroundColor: "#22211B",
                    fontSize: "25px",
                  }}
                  onClick={goToRoom}
                  endIcon={<PublicIcon />}
                >
                  SALAS GRUPALES
                </Button>{" "}
              </Grid>
              <Grid
                item
                xs={14}
                sx={{
                  height: "10vh",
                  width: "100vh",
                  backgroundColor: "#6B6465",
                }}
              >
                {" "}
                <Button
                  variant="contained"
                  sx={{
                    height: "10vh",
                    width: "100vh",
                    backgroundColor: "#22211B",
                    fontSize: "25px",
                  }}
                  onClick={handleOpen}
                  endIcon={<TravelExploreIcon />}
                >
                  MENSAJES PRIVADOS
                </Button>{" "}
              </Grid>
              <Grid
                item
                xs={14}
                sx={{
                  height: "10vh",
                  width: "100vh",
                  backgroundColor: "#6B6465",
                }}
              >
                {" "}
                <Button
                  variant="contained"
                  onClick={logout}
                  sx={{
                    height: "10vh",
                    width: "100vh",
                    backgroundColor: "#E52C07",
                    fontSize: "25px",
                  }}
                  endIcon={<LogoutIcon />}
                >
                  DESCONECTARSE
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{ height: "10vh", width: "100vh", backgroundColor: "#6B6465" }}
          ></Box>
          <Box sx={{ height: "35vh", width: "100vh", backgroundColor: "gray" }}>
            <Item sx={{ height: "5vh" }}> Mensajes privados </Item>
            <List
              sx={{
                width: "100%",
                height: "30vh",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                "& ul": { padding: 0 },
              }}
              subheader={<li />}
            >
              {privateMessages.map((item) =>
                item[4] === window.localStorage.getItem("user").toString() ? (
                  <ListItem key={`item-${item}`}>
                    <ListItemText
                      primary={`Enviado por: ${item[0]} ${item[1]} a las ${item[2]}`}
                      secondary={`${item[3]}`}
                    />
                  </ListItem>
                ) : (
                  <></>
                )
              )}
            </List>
          </Box>
        </Grid>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          onSubmit={sendMessage}
          onChange={changeForm}
        >
          <InputLabel id="demo-simple-select-label">Correo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="email"
            value={inputs.email}
            label="Age"
            onChange={changeForm}
          >
            {users.map((item) => (
              <MenuItem value={item[2]}>{item[2]}</MenuItem>
            ))}
          </Select>
          <TextField
            margin="normal"
            required
            fullWidth
            name="message"
            label="Mensaje"
            type="text"
            id="message"
            multiline
            inputProps={{ maxLength: 150 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar
          </Button>
        </Box>
      </Modal>
      <Snackbar open={full} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} variant="filled" severity="error">
          {wrg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MainPage;
