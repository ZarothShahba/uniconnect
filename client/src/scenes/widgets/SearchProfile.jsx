import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

const SearchProfile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.token);

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
      <Paper
        elevation={3}
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
      </Paper>

      {searchResults.length > 0 && (
        <List>
          {searchResults.map((result) => (
            <ListItem key={result._id}>
              <Paper
                elevation={3}
                style={{
                  padding: "1rem",
                  borderRadius: "9px",
                  marginBottom: "0.5rem",
                }}
              >
                <ListItemText
                  primary={`${result.firstName} ${result.lastName}`}
                  // Add other information you want to display
                />
              </Paper>
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
