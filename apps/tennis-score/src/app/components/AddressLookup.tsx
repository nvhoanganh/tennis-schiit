pmport classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

const AddressLookup: React.SFC<{
  label: string;
  name: string;
  errorMessage?: string;
  isValid?: boolean;
  value?: any;
  disabled?: boolean;
  placeholder?: string;
  setValue(name: string, value: any);
}> = ({
  label,
  name,
  isValid,
  placeholder,
  value,
  setValue,
  errorMessage,
  disabled
}) => {
  const [dirty, setDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [className, setClassName] = useState("");
  useEffect(() => {
    inputRef.current.setCustomValidity(!isValid ? "weak" : "");
    setClassName(
      classNames({
        "form-control": true,
        "is-invalid": !isValid && dirty
      })
    );
  }, [isValid, dirty]);

  const handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        setValue(`${name}LongLat`, latLng);
      })
      .catch(error => console.error("Error", error));
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <PlacesAutocomplete
        value={value}
        onChange={e => {
          setValue(name, e);
          setDirty(true);
        }}
        className={className}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <input
              ref={inputRef}
              disabled={disabled}
              placeholder={placeholder}
              className={className}
              {...getInputProps({
                placeholder: "Search Places",
                className: className
              })}
            />
            <div
              className={
                "autocomplete-dropdown-container " +
                ((loading || suggestions.length > 0) && " border rounded")
              }
            >
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active py-1 px-1 font-weight-bold border"
                  : "suggestion-item py-1 px-2";
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PlacesAutocomplete>
      <div className="invalid-feedback">{errorMessage}</div>
    </div>
  );
};
export default AddressLookup;
