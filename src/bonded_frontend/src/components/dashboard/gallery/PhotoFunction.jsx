import { useState, useEffect } from 'react'
import { AuthClient } from "@dfinity/auth-client"
import { getIdentity } from '@/services/ii'

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [visibleCount, setVisibleCount] = useState(4)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { authenticatedActor } = await getIdentity()

        const authClient = await AuthClient.create()
        const identity = authClient.getIdentity()
        const principal = identity.getPrincipal()

        if (!principal) {
          console.error("No principal found in identity")
          return
        }

        const userRes = await authenticatedActor.get_user()
        const partnerRes = await authenticatedActor.get_partner()

        if (!('Ok' in userRes) || !('Ok' in partnerRes)) {
          console.error("Failed to fetch user or partner")
          return
        }

        const user = userRes.Ok
        const partner = partnerRes.Ok

        const res = await authenticatedActor.get_photos()
        if ('Ok' in res) {
          const fetched = res.Ok

          const converted = await Promise.all(
            fetched.map((photo, idx) => {
              return new Promise(resolve => {
                if (photo.data && photo.data.length > 0) {
                  const uint8Array = new Uint8Array(photo.data)
                  const blob = new Blob([uint8Array], { type: 'image/jpeg' })
                  const reader = new FileReader()
                  reader.readAsDataURL(blob)

                  reader.onloadend = () => {
                    const timestamp = new Date(Number(photo.timestamp) / 1_000_000)

                    const isCallerSender = String(photo.user) === principal.toText()

                    const formatName = (u) =>
                      [u.firstname, u.middlename, u.lastname]
                        .filter(Boolean)
                        .join(" ")

                    const fromFullname = isCallerSender
                      ? formatName(user)
                      : formatName(partner)

                    const toFullname = isCallerSender
                      ? formatName(partner)
                      : formatName(user)

                    resolve({
                      src: reader.result,
                      date: timestamp.toISOString().split('T')[0],
                      time: timestamp.toLocaleTimeString(),
                      tokenId: `#${photo.id ?? idx}`,
                      title: `Image${idx + 1}`,
                      coords: photo.coords ?? 'Unknown',
                      platform: photo.platform ?? 'Unknown',
                    //   people: `From ${fromFullname} to ${toFullname}`,
                        people: `From ${fromFullname}`,
                      description: photo.description ?? ''
                    })
                  }
                } else {
                  resolve({
                    src: '',
                    date: '',
                    time: '',
                    tokenId: `#${photo.id ?? idx}`,
                    people: 'Unknown'
                  })
                }
              })
            })
          )

          setPhotos(converted)
        } else {
          console.error("get_photos error:", res.Err)
        }
      } catch (err) {
        console.error("Failed to fetch photos:", err)
      }
    }

    fetchPhotos()
  }, [])

  const filteredPhotos =
    dateFrom && dateTo
      ? photos.filter(p => p.date >= dateFrom && p.date <= dateTo)
      : photos

  const onChangeFrom = e => {
    setDateFrom(e.target.value || '')
    setVisibleCount(4)
  }

  const onChangeTo = e => {
    setDateTo(e.target.value || '')
    setVisibleCount(4)
  }

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
