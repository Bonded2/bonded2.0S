import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchTerm, selectNationality, saveNationality, editNationality } from "@/store/slices/profileSlice";

export const NationalitiesFunction = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { nationalities } = useAppSelector((state) => state.profile);

    // Get data from Redux store
    const searchTerm = nationalities.searchTerm;
    const selectedNationality = nationalities.selectedNationality;
    const isSaved = nationalities.isSaved;
    const country = nationalities.availableCountries;

    // ANCHOR: Handle navigation to different steps
    const handleNavigateToStep = (path) => {
        navigate(path);
    };

    // ANCHOR: Handle search functionality
    const handleSearch = (searchValue) => {
        console.log('Searching for:', searchValue);
        // TODO: Implement search logic if needed
    };

    // ANCHOR: Handle nationality selection from dropdown
    const handleNationalitySelect = (nationality) => {
        dispatch(selectNationality(nationality));
        console.log('Selected nationality:', nationality);
    };

    // ANCHOR: Handle save button click
    const handleSave = () => {
        if (selectedNationality) {
            dispatch(saveNationality());
            console.log('Nationality saved:', selectedNationality);
        }
    };

    // ANCHOR: Handle edit button click
    const handleEdit = () => {
        dispatch(editNationality());
    };

    // ANCHOR: Handle search term update
    const handleSetSearchTerm = (term) => {
        dispatch(setSearchTerm(term));
    };

    return {
        // State
        searchTerm,
        setSearchTerm: handleSetSearchTerm,
        selectedNationality,
        isSaved,

        // Functions
        handleNavigateToStep,
        handleSearch,
        handleNationalitySelect,
        handleSave,
        handleEdit,

        // Data
        country,

        // Navigation
        navigate
    }
}