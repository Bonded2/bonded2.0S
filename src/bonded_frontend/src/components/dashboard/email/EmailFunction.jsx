import { useState } from 'react'
import { Mail } from 'lucide-react'

export const useEmailGallery = () => {
    const emailsData = [
        {
            id: 1,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-01',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
        },
        {
            id: 2,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-02',
            message: 'Raquel has sent you a message inLorem ipsum dolor sit amet consectetur. Eget quam veli... Openchat.',
        },
        {
            id: 3,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-03',
            message: 'Raquel has sent you a message inLorem ipsum dolor sit amet consectetur. Eget quam veli... Openchat.',
        },
        {
            id: 4,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-04',
            message: 'Raquel has sent you a message inLorem ipsum dolor sit amet consectetur. Eget quam veli... Openchat.',
        },
        {
            id: 5,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-05',
            message: 'Raquel has sent you a message inLorem ipsum dolor sit amet consectetur. Eget quam veli... Openchat.',
        },
        {
            id: 6,
            icon: <Mail />,
            title: 'Gmail',
            date: '2025-01-06',
            message: 'Raquel has sent you a message inLorem ipsum dolor sit amet consectetur. Eget quam veli... Openchat.',
        },
    ]

    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [visibleCount, setVisibleCount] = useState(4)
    const [isLoading, setIsLoading] = useState(false)

    // ANCHOR: Handlers that also reset pagination when range changes
    const onChangeFrom = (e) => {
        setDateFrom(e.target.value || '')
        setVisibleCount(4)
    }
    const onChangeTo = (e) => {
        setDateTo(e.target.value || '')
        setVisibleCount(4)
    }

    // ANCHOR: Filter emails only when both dates are selected (inclusive)
    const filteredEmails = (dateFrom && dateTo)
        ? emailsData.filter((email) => email.date >= dateFrom && email.date <= dateTo)
        : emailsData

    return {
        emails: filteredEmails,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        visibleCount,
        setVisibleCount,
        isLoading,
        setIsLoading,
        onChangeFrom,
        onChangeTo
    }
}

export default useEmailGallery
