import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setPrimaryResidence,
    addOtherAddress,
    updateOtherAddress,
    removeOtherAddress,
    saveResidencies,
    editResidencies
} from "@/store/slices/profileSlice";

export const ResidenciesFunction = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { residencies } = useAppSelector((state) => state.profile);

    // Get data from Redux store
    const isEditing = !residencies.isSaved;
    const primaryResidence = residencies.primaryResidence;
    const otherAddresses = residencies.otherAddresses;

    const handleNavigateToStep = (path) => {
        navigate(path);
    };

    const handleSaveResidency = () => {
        dispatch(saveResidencies());
    };

    const handleEditResidency = () => {
        dispatch(editResidencies());
    };

    // ANCHOR: Add new address input field
    const addAddress = () => {
        dispatch(addOtherAddress());
    };

    // ANCHOR: Update specific address value
    const updateAddress = (id, value) => {
        dispatch(updateOtherAddress({ id, value }));
    };

    // ANCHOR: Remove address input field
    const removeAddress = (id) => {
        dispatch(removeOtherAddress(id));
    };

    // ANCHOR: Update primary residence value
    const updatePrimaryResidence = (value) => {
        dispatch(setPrimaryResidence(value));
    };

    return {
        navigate,
        handleNavigateToStep,
        handleSaveResidency,
        handleEditResidency,
        isEditing,
        primaryResidence,
        otherAddresses,
        addAddress,
        updateAddress,
        removeAddress,
        updatePrimaryResidence,
    }
}