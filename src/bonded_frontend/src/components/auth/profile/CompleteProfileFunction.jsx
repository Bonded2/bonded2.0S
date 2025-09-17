import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export const CompleteProfileFunction = () => {
    const navigate = useNavigate();
    const { profilePhoto, nationalities, residencies, uploadedFiles } = useAppSelector((state) => state.profile);

    const iconMap = {
        'marriage-certificate': 'Heart',
        'bank-statement': 'DollarSign',
        'utility-bill': 'Droplet',
        'other': 'ThumbsUp',
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatPrettyDateRange = (range) => {
        if (!range || !range.start) return 'Not specified';
        const startDate = typeof range.start === 'string' ? new Date(range.start) : range.start;
        const endDate = range.end ? (typeof range.end === 'string' ? new Date(range.end) : range.end) : null;

        const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
        const startDay = startDate.getDate();
        const startYear = startDate.getFullYear();

        if (!endDate || startDate.getTime() === endDate.getTime()) {
            return `${startMonth} ${startDay}, ${startYear}`;
        }

        const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
        const endDay = endDate.getDate();
        const endYear = endDate.getFullYear();

        if (startYear === endYear) {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
        }

        return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
    };

    const handleNavigateToStep = (path) => {
        navigate(path);
    };

    return {
        navigate,
        profilePhoto,
        nationalities,
        residencies,
        uploadedFiles,
        iconMap,
        formatDate,
        formatPrettyDateRange,
        handleNavigateToStep,
    };
};