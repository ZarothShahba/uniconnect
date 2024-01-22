import { Typography } from "@mui/material";
import React, { useState } from "react";
import { Modal, TextField, Button, Box, IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CreateEventForm = ({ isOpen, onClose }) => {
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  // State to manage form inputs
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventVenue: "",
    eventDescription: "",
    // Add more fields as needed
  });

  // Function to handle form submission
  const handleCreateEvent = async () => {
    try {
      // Check if required fields are filled
      if (
        !eventData.eventName ||
        !eventData.eventDate ||
        !eventData.eventTime ||
        !eventData.eventVenue ||
        !eventData.eventDescription
      ) {
        toast.error("Fill all the Fields");
        console.error("Please provide all the details");
        // You can also display a user-friendly error message if needed
        return;
      }

      // Make the API request to create an event
      const response = await fetch("http://localhost:3001/posts/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include your token here
        },
        body: JSON.stringify({
          userId: _id, // Assuming you have _id from your Redux state
          title: eventData.eventName,
          description: eventData.eventDescription,
          startDate: eventData.eventDate,
          time: eventData.eventTime,
          venue: eventData.eventVenue,
        }),
      });

      if (!response.ok) {
        // Check if the request was unsuccessful
        const errorData = await response.json();
        console.error("Error creating event:", errorData.error);
        toast.error(errorData);
        return;
      }

      // If the event is successfully created
      const data = await response.json();
      console.log("Event created successfully:", data);
      toast.success("Event Created!");
      // Reset form data
      setEventData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventVenue: "",
        eventDescription: "",
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      // You can also display a user-friendly error message if needed
      toast.error(error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Post a New Event
        </Typography>
        <IconButton onClick={onClose} sx={{ marginLeft: 38, marginTop: -7 }}>
          <Close color="error" />
        </IconButton>
        {/* Event Name */}
        <TextField
          label="Event Name"
          fullWidth
          value={eventData.eventName}
          onChange={(e) =>
            setEventData({ ...eventData, eventName: e.target.value })
          }
          margin="normal"
        />
        {/* Event Date */}
        <TextField
          label="Event Date"
          fullWidth
          value={eventData.eventDate}
          onChange={(e) =>
            setEventData({ ...eventData, eventDate: e.target.value })
          }
          margin="normal"
        />
        {/* Event Time */}
        <TextField
          label="Event Time"
          fullWidth
          value={eventData.eventTime}
          onChange={(e) =>
            setEventData({ ...eventData, eventTime: e.target.value })
          }
          margin="normal"
        />
        {/* Event Venue */}
        <TextField
          label="Event Venue"
          fullWidth
          value={eventData.eventVenue}
          onChange={(e) =>
            setEventData({ ...eventData, eventVenue: e.target.value })
          }
          margin="normal"
        />

        {/* Event Description */}
        <TextField
          label="Event Description"
          fullWidth
          multiline
          rows={4}
          value={eventData.eventDescription}
          onChange={(e) =>
            setEventData({ ...eventData, eventDescription: e.target.value })
          }
          margin="normal"
        />
        {/* Add more fields as needed */}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
          >
            Post Event
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default CreateEventForm;
