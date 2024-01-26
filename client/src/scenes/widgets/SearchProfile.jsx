import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchProfile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();

  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const handleSearch = async () => {
    // Make an API call to search for users
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3001/users/search/${searchQuery}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      // Ensure data is an array before setting it as search results
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box
        style={{
          borderRadius: "9px",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
          style={{ marginRight: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <Search />
        </Button>
        {isLoading && (
          <CircularProgress size={20} style={{ marginLeft: "1rem" }} />
        )}
      </Box>

      {searchResults.length > 0 && (
        <List>
          {searchResults.map((result) => (
            <ListItem key={result._id}>
              <Card
                elevation={3}
                sx={{
                  width: "100%",
                  "&:hover": {
                    transform: "scale(1.02)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/profile/${result._id}`)}
              >
                <Box display="flex" alignItems="center" padding="1rem">
                  <Avatar
                    alt={`${result.firstName} ${result.lastName}'s Profile Picture`}
                    src={`http://localhost:3001/public/assets/picture/${result.picturePath}`}
                  />
                  <CardContent style={{ marginLeft: "1rem" }}>
                    <Typography variant="h6">
                      {result.firstName} {result.lastName}
                    </Typography>
                    {/* Add other information you want to display */}
                  </CardContent>
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
      )}

      {searchResults.length === 0 && !isLoading && (
        <Typography variant="body2">No results found.</Typography>
      )}
    </Box>
  );
};

export default SearchProfile;
