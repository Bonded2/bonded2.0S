import { getIdentity } from '../../../services/ii'

export const useUploadPhoto = () => {

    // Convert base64 to Blob
    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) u8arr[n] = bstr.charCodeAt(n)
        return new Blob([u8arr], { type: mime })
    }

    // Compress image Blob or File to JPEG base64
    const compressImage = async (fileOrBlob, quality = 0.7, maxWidth = 800) => {
        const bitmap = await createImageBitmap(fileOrBlob)
        const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1

        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width * scale
        canvas.height = bitmap.height * scale

        const ctx = canvas.getContext('2d')
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob)
                    else reject(new Error('Image compression failed'))
                },
                'image/jpeg',
                quality
            )
        })
    }

    const handlePhotoUpload = async (file) => {
        if (!file) return;

        try {
            let fileToCompress = file
            if (typeof file === 'string') {
                fileToCompress = dataURLtoBlob(file)
            }

            const auth = await getIdentity()
            const { identity: userIdentity, authenticatedActor } = auth

            const compressed = await compressImage(fileToCompress)
            const arrayBuffer = await compressed.arrayBuffer()
            const photo = new Uint8Array(arrayBuffer)

            const photodata = await authenticatedActor.upload_photo([...photo])

            if (photodata.Ok) {
                console.log('Photo uploaded successfully:', photodata.Ok)
                return { success: true, data: photodata.Ok }
            } else {
                console.log('Photo upload failed:', photodata.Err)
                return { success: false, error: photodata.Err }
            }
        } catch (error) {
            console.error('Error uploading photo:', error)
            return { success: false, error: error.message }
        }
    };

    return {
        handlePhotoUpload,
        dataURLtoBlob,
        compressImage,
    }
}