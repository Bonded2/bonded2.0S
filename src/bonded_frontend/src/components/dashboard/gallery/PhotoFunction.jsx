import { useState } from 'react'
import Rimuro from '@/assets/example/rimuro.jpg'

export const usePhotoGallery = () => {
    const photos = [
        {
            src: Rimuro,
            date: '2025-01-01',
            time: '21:45 PM',
            tokenId: '#23456',
            title: 'Image101',
            coords: '34.0549° N, 118.2426° W',
            platform: 'Facebook',
            people: 'Tobias McCartney & Emilia Vasquez',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc. Morbi iaculis, elit vitae dictum maximus, augue elit aliquam erat, vitae mattis justo odio sit amet quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst. Nam eget venenatis leo. Quisque at libero id nunc dictum laoreet. Aenean nec purus ac velit tempor aliquet at vitae nibh. Suspendisse potenti. Proin a velit ac tortor gravida ullamcorper nec id lorem.'
        },
        {
            src: Rimuro,
            date: '2025-01-02',
            time: '21:45 PM',
            tokenId: '#23457',
            title: 'Image102',
            coords: '34.0549° N, 118.2426° W',
            platform: 'Facebook',
            people: 'Tobias McCartney & Emilia Vasquez',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.'
        },
        {
            src: Rimuro,
            date: '2025-01-03',
            time: '21:45 PM',
            tokenId: '#23458',
            title: 'Image103',
            coords: '34.0549° N, 118.2426° W',
            platform: 'Facebook',
            people: 'Tobias McCartney & Emilia Vasquez',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            src: Rimuro,
            date: '2025-01-04',
            time: '21:45 PM',
            tokenId: '#23459',
            title: 'Image104',
            coords: '34.0549° N, 118.2426° W',
            platform: 'Facebook',
            people: 'Tobias McCartney & Emilia Vasquez',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        },
        {
            src: Rimuro,
            date: '2025-01-05',
            time: '21:45 PM',
            tokenId: '#23460',
            title: 'Image105',
            coords: '34.0549° N, 118.2426° W',
            platform: 'Facebook',
            people: 'Tobias McCartney & Emilia Vasquez',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
    ]

    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [visibleCount, setVisibleCount] = useState(4)
    const [isLoading, setIsLoading] = useState(false)

    // Handlers that also reset pagination when range changes
    const onChangeFrom = (e) => {
        setDateFrom(e.target.value || '')
        setVisibleCount(4)
    }
    const onChangeTo = (e) => {
        setDateTo(e.target.value || '')
        setVisibleCount(4)
    }

    // Filter photos only when both dates are selected (inclusive)
    const filteredPhotos = (dateFrom && dateTo)
        ? photos.filter((p) => p.date >= dateFrom && p.date <= dateTo)
        : photos

    return {
        photos: filteredPhotos,
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

export default usePhotoGallery