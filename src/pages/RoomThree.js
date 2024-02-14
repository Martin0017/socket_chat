import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SendIcon from "@mui/icons-material/Send";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const RoomThree = () => {
  const listRef = useRef(null);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [inputs, setInputs] = useState({
    message: "",
    font: "unset"
  });

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const changeForm = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = () => {
    socket.send(
        JSON.stringify({
          method: "RegisterMessage",
          emailSend: window.localStorage.getItem("user"),
          font: inputs.font,
          messageSend: inputs.message
        })
      );
    inputs.message = "";
  }

  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight;

    const ws = new WebSocket("ws://localhost:666/websocket/roomthree");
    setSocket(ws);
    ws.onopen = () => {
      console.log("Connected to WebSocket server", "message");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            method: "GetMessages",
          })
        );
      } else {
        console.error("La conexión WebSocket no está abierta aún.");
      }
    };

    ws.onmessage = (event) => {
      const datosParse = JSON.parse(event.data);
      setMessages(datosParse.data);
    };

  }, []);

  const toMain = () => {
    navigate("/main");
    window.location.reload();
  }

  const navigate = useNavigate();

  return (
    <>
      <Box>
        <Grid container>
          <Grid
            item
            xs={2}
            sx={{
              height: "100vh",
              background:
                "url(https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmVydGljYWwlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Grid>
          <Grid item xs={6}>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}> <Item sx={{ height: "10vh", backgroundColor: "#22102D", color: "white", fontSize: 30 }}> SALA 3 </Item> </Box>
            <Box sx={{ height: "70vh", backgroundColor: "whitesmoke" }}>
              <List
                sx={{
                  width: "100%",
                  height: "70vh",
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  "& ul": { padding: 0 },
                }}
                ref={listRef}
              >
                {messages.map(
                  (item) => (
                    <ListItem key={`item--${item[2]}`}>
                      <ListItemText
                        primaryTypographyProps={{ fontFamily: `${item[3]}` }}
                        primary={`${item[2]}`}
                        secondary={`${item[0]} ${item[1]} el ${item[4]}`}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Box>
            <Box sx={{ height: "20vh", backgroundColor: "#22102D" }}>
              <TextField
                fullWidth
                name="message"
                value={inputs.message}
                onChange={changeForm}
                sx={{
                  width: "90vh",
                  marginTop: "5vh",
                  backgroundColor: "whitesmoke",
                  borderRadius: "8px",
                }}
                label="Escriba su mensaje..."
                id="fullWidth"
              />
              <Button
                sx={{ marginTop: "5vh", backgroundColor: "green" }}
                variant="contained"
                onClick={sendMessage}
                endIcon={<SendIcon />}
              >
                Enviar
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{ height: "100vh", backgroundColor: "#22102D" }}
          >
            <Box sx={{ height: "50vh", backgroundColor: "#22102D" }}></Box>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Estilo</InputLabel>
                <Select
                  sx={{ color: "white", backgroundColor: "black" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputs.font}
                  label="Estilo"
                  name="font"
                  onChange={changeForm}
                >
                  <MenuItem value={"cursive"}>Cursiva</MenuItem>
                  <MenuItem value={"fantasy"}>Fantasia</MenuItem>
                  <MenuItem value={"monospace"}>MonoSpace</MenuItem>
                  <MenuItem value={"sans-serif"}>Sans-Serif</MenuItem>
                  <MenuItem value={"serif"}>Serif</MenuItem>
                  <MenuItem value={"unset"}>Unset</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}></Box>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}></Box>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}></Box>
            <Box sx={{ height: "10vh", backgroundColor: "#22102D" }}>
            <Button variant="contained" sx={{width: "70vh", backgroundColor: "red"}} onClick={toMain} endIcon={<ExitToAppIcon />}>
        Salir
      </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RoomThree;
