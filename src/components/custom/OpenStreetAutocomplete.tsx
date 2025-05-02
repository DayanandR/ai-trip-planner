import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";

interface Place {
  lat: string;
  lon: string;
  name: string;
}

interface OpenStreetAutocompleteProps {
  handleInputChange?: (name: string, value: string) => void;
}

export function OpenStreetAutocomplete({
  handleInputChange,
}: OpenStreetAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Place[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [selecting, setSelecting] = useState(false); 
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchOptions = async (query: string) => {
    if (!query.trim()) {
      setOptions([]);
      setSearchAttempted(false);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      const formatted: Place[] = data.map((place: any) => ({
        lat: place.lat,
        lon: place.lon,
        name: place.display_name,
      }));

      setOptions(formatted);
      setSearchAttempted(true);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setOptions([]);
      setSearchAttempted(true);
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only fetch options if not selecting an item
    if (!selecting) {
      debounceTimer.current = setTimeout(() => {
        fetchOptions(inputValue);
      }, 300);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, selecting]);

  const handleSelect = (place: Place) => {
    setInputValue(place.name);
    setShowDropdown(false);
    setSelecting(true); // Set selecting to true
    handleInputChange?.("destination", place.name);
  };

  const handleClear = () => {
    setInputValue("");
    setOptions([]);
    setSearchAttempted(false);
    setShowDropdown(false);
    handleInputChange?.("destination", "");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selecting) {
      const timeout = setTimeout(() => {
        setSelecting(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [selecting]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ width: "100%", position: "relative" }}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for a destination..."
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
          title={inputValue}
        />
      </div>

      {inputValue && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ❌
        </button>
      )}

      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: 200,
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {options.length > 0 ? (
            options.map((place, index) => (
              <li
                key={index}
                onClick={() => handleSelect(place)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={place.name}
              >
                {place.name}
              </li>
            ))
          ) : searchAttempted ? (
            <li style={{ padding: "8px", color: "#999" }}>No matches found.</li>
          ) : (
            <li style={{ padding: "8px", color: "#999" }}>
              Start typing a location...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
