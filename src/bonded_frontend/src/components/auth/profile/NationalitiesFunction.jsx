import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearchTerm,
  selectNationality,
  addNationalityDropdown,
  removeNationalityDropdown,
  saveNationality,
  editNationality,
} from "@/store/slices/profileSlice";

export const NationalitiesFunction = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { nationalities } = useAppSelector((state) => state.profile);

  // Get data from Redux store
  const dropdowns = nationalities.dropdowns;
  const selectedNationalities = nationalities.selectedNationalities;
  const isSaved = nationalities.isSaved;
  const country = nationalities.availableCountries;

  // ANCHOR: Handle navigation to different steps
  const handleNavigateToStep = (path) => {
    navigate(path);
  };

  // ANCHOR: Handle search functionality
  const handleSearch = (searchValue) => {
    console.log("Searching for:", searchValue);
    // TODO: Implement search logic if needed
  };

  // ANCHOR: Handle nationality selection from dropdown
  const handleNationalitySelect = (id, nationality) => {
    dispatch(selectNationality({ id, nationality }));
    console.log("Selected nationality:", nationality);
  };

  // ANCHOR: Handle adding a new dropdown
  const handleAddDropdown = () => {
    dispatch(addNationalityDropdown());
  };

  // ANCHOR: Handle removing a dropdown
  const handleRemoveDropdown = (id) => {
    dispatch(removeNationalityDropdown(id));
  };

  // ANCHOR: Handle save button click
  const handleSave = () => {
    // Check if at least one nationality is selected
    const hasSelectedNationality = dropdowns.some(d => d.selectedNationality !== null);
    if (hasSelectedNationality) {
      dispatch(saveNationality());
      console.log("Nationalities saved:", selectedNationalities);
    }
  };

  // ANCHOR: Handle edit button click
  const handleEdit = () => {
    dispatch(editNationality());
  };

  // ANCHOR: Handle search term update for specific dropdown
  const handleSetSearchTerm = (id, term) => {
    dispatch(setSearchTerm({ id, searchTerm: term }));
  };

  return {
    // State
    dropdowns,
    selectedNationalities,
    isSaved,

    // Functions
    handleNavigateToStep,
    handleSearch,
    handleNationalitySelect,
    handleAddDropdown,
    handleRemoveDropdown,
    handleSave,
    handleEdit,
    handleSetSearchTerm,

    // Data
    country,

    // Navigation
    navigate,
  };
};
