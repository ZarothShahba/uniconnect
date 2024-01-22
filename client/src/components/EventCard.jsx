import { Typography, useTheme, Divider } from "@mui/material";
import { DateRangeOutlined, LocationOnOutlined } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import FlexBetween2 from "components/FlexBetween2";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { setEvent, setGroups } from "state";

const AdvertWidget = () => {
  const { palette } = useTheme();
  // const dark = palette.neutral.dark;
  // const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const events = useSelector((state) => state.events);

  const handleGroups = async () => {
    const fetchAllGroups = await fetch("http://localhost:3001/groups/getAll", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!fetchAllGroups.ok) {
      const errorData = await fetchAllGroups.json();
      toast.error("Error fetching all groups", errorData);
      return;
    }

    const allGroups = await fetchAllGroups.json();
    // dispatch(setGroups({ allGroups }));
    dispatch(setGroups({ groups: allGroups }));
  };

  const handleEvents = useCallback(async () => {
    try {
      const getEvents = await fetch("http://localhost:3001/posts/get-events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!getEvents.ok) {
        const errorData = await getEvents.json();
        toast.error(errorData.error);
        return;
      }
      const eventsData = await getEvents.json();
      dispatch(
        setEvent({
          events: eventsData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        })
      );
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(error.message);
    }
  }, [token, dispatch, events]);

  useEffect(() => {
    handleEvents();
    handleGroups();
  }, [handleEvents]);

  return (
    <WidgetWrapper>
      {events.map((event) => (
        <div key={event._id}>
          <FlexBetween>
            <Typography color="#1C768F" fontWeight="500">
              {event.title}
            </Typography>
          </FlexBetween>

          {/* Starting Date and Time of Event */}
          <FlexBetween2>
            <DateRangeOutlined sx={{ color: "#1C768F", fontSize: "1rem" }} />
            <Typography color={medium}>
              {event.startDate} | {event.time}
            </Typography>
          </FlexBetween2>
          <FlexBetween2>
            <LocationOnOutlined sx={{ color: "#1C768F", fontSize: "1rem" }} />
            <Typography color={medium}>{event.venue}</Typography>
          </FlexBetween2>

          <Typography color={medium} m="0.5rem 0">
            {event.description}
          </Typography>
          <Divider />
        </div>
      ))}
    </WidgetWrapper>
  );
};

export default AdvertWidget;
