import { useState } from 'react'
import { File } from 'lucide-react'

export const useDocumentGallery = () => {
    const documentsData = [
        {
            id: 1,
            icon: <File />,
            title: 'Word Document',
            date: 'LEGAL',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
        },
        {
            id: 2,
            icon: <File />,
            title: 'Text Document',
            date: 'LEGAL',
            content: 'This is a sample text document with important information. The content includes various details about the project and its requirements.',
        },
        {
            id: 3,
            icon: <File />,
            title: 'Image Document',
            date: 'LEGAL',
            content: 'This document contains image files and visual content. It includes diagrams, charts, and other graphical elements.',
        },
        {
            id: 4,
            icon: <File />,
            title: 'PDF Document',
            date: 'LEGAL',
            content: 'This is a PDF document with formatted content. It includes text, images, and other multimedia elements.',
        },
        {
            id: 5,
            icon: <File />,
            title: 'Report Document',
            date: 'LEGAL',
            content: 'This document contains a comprehensive report with detailed analysis and findings.',
        },
        {
            id: 6,
            icon: <File />,
            title: 'Presentation Document',
            date: 'LEGAL',
            content: 'This document includes presentation slides and visual materials for meetings and presentations.',
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

    // ANCHOR: Filter documents only when both dates are selected (inclusive)
    const filteredDocuments = (dateFrom && dateTo)
        ? documentsData.filter((document) => document.date >= dateFrom && document.date <= dateTo)
        : documentsData

    return {
        documents: filteredDocuments,
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

export default useDocumentGallery