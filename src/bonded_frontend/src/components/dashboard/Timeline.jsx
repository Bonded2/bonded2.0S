import React, { useEffect, useState } from 'react'
import { getIdentity } from '@/services/ii'

const Timeline = () => {
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const { authenticatedActor } = await getIdentity()
                const res = await authenticatedActor.get_photos()
                if ('Ok' in res) {
                    const fetched = res.Ok

                    // convert Vec<u8> -> base64 data URL
                    const converted = await Promise.all(
                        fetched.map(photo =>
                            new Promise(resolve => {
                                if (photo.data && photo.data.length > 0) {
                                    const uint8Array = new Uint8Array(photo.data)
                                    const blob = new Blob([uint8Array], { type: 'image/jpeg' })
                                    const reader = new FileReader()
                                    reader.readAsDataURL(blob)
                                    reader.onloadend = () => {
                                        resolve({ ...photo, dataUrl: reader.result })
                                    }
                                } else {
                                    resolve({ ...photo, dataUrl: null })
                                }
                            })
                        )
                    )

                    setPhotos(converted)
                } else {
                    console.error(res.Err)
                }
            } catch (err) {
                console.error('Failed to fetch photos', err)
            }
        }
        fetchPhotos()
    }, [])

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', padding: '16px' }}>
            {photos.length === 0 ? (
                <p style={{ color: '#666', fontSize: '14px' }}>No photos yet</p>
            ) : (
                photos.map((photo, i) => (
                    <div
                        key={photo.id || i}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {photo.dataUrl ? (
                            <img
                                src={photo.dataUrl}
                                alt={`Photo ${i}`}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f3f3f3',
                                    color: '#999',
                                    fontSize: '14px'
                                }}
                            >
                                No image data
                            </div>
                        )}
                        <div
                            style={{
                                padding: '8px',
                                fontSize: '12px',
                                color: '#555',
                                borderTop: '1px solid #eee'
                            }}
                        >
                            {new Date(Number(photo.timestamp) / 1_000_000).toLocaleString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Timeline
