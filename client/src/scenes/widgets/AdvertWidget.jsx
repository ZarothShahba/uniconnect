import { Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import EventCard from "components/EventCard";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useState } from "react";
import CreateEventForm from "components/CreateEvent";

const AdvertWidget = () => {
  const [isCreateEventModalOpen, setCreateEventModalOpen] = useState(false);

  const handleOpenCreateEventModal = () => {
    setCreateEventModalOpen(true);
  };

  const handleCloseCreateEventModal = () => {
    setCreateEventModalOpen(false);
  };

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color="#FA991C" variant="h4" fontWeight="500">
          Upcoming Events
        </Typography>
        <Typography color="primary" onClick={handleOpenCreateEventModal}>
          Post Event
        </Typography>
      </FlexBetween>
      {/* Other content */}
      <EventCard />
      {/* Create Group Modal */}
      <CreateEventForm
        isOpen={isCreateEventModalOpen}
        onClose={handleCloseCreateEventModal}
      />
    </WidgetWrapper>
  );
};

export default AdvertWidget;