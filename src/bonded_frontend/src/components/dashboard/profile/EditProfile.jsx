import React, { useState } from 'react'
import styles from './scss/_editprofile.module.scss'
import Button from '@/reusable/Button'
import Breadcrumb from '@/reusable/Breadcrumb'
import { useNavigate } from 'react-router-dom'
import Input from '@/reusable/Input'
import { Pencil } from 'lucide-react'
import { Session } from '../../../routes/SessionProvider'

const EditProfile = () => {
  const navigate = useNavigate()
  const { userData } = Session()

  // ANCHOR: Form state management
  const [formData, setFormData] = useState({
    firstname: userData?.firstname || '',
    middlename: userData?.middlename || '',
    lastname: userData?.lastname || '',
    passportnumber: userData?.passportnumber || '',
    sex: userData?.gender || '',
    nationality: userData?.nationality || '',
    dateofbirth: userData?.dateofbirth || '',
    placeofbirth: userData?.placeofbirth || '',
    dateofissue: userData?.dateofissue || '',
  })

  const handleNavigateToStep = (path) => {
    navigate(path);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const breadcrumbItems = [
    { label: 'Profile Information', to: '/dashboard/profile-information' },
  ];

  return (
    <div className={styles.editProfileContainer}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.header}>
        <p className={styles.headerTitle}>Edit Profile</p>
      </div>

      <div className={styles.editProfileContent}>
        {/* ANCHOR: Profile Image Section */}
        <div className={styles.editProfileImage}>
          <img src={userData?.profile || '/icons/icon-384x384.png'} alt="Edit Profile" />
          <div className={styles.imageEditIcon}>
            <Pencil size={16} />
          </div>
        </div>

        {/* ANCHOR: Form Section */}
        <div className={styles.editProfileForm}>
          {/* ANCHOR: First Row - First Name & Middle Name */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input 
                label="First name" 
                type="text" 
                id="firstname" 
                placeholder="Enter first name" 
                value={formData.firstname}
                onChange={(e) => handleInputChange('firstname', e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <Input 
                label="Middle name(s)" 
                type="text" 
                id="middlename" 
                placeholder="Enter middle name" 
                value={formData.middlename}
                onChange={(e) => handleInputChange('middlename', e.target.value)}
              />
            </div>
          </div>

          {/* ANCHOR: Second Row - Last Name */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input 
                label="Last name" 
                type="text" 
                id="lastname" 
                placeholder="Enter last name" 
                value={formData.lastname}
                onChange={(e) => handleInputChange('lastname', e.target.value)}
              />
            </div>
          </div>

          {/* ANCHOR: Third Row - Passport Number & Sex */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input 
                label="Passport Number" 
                type="text" 
                id="passportnumber" 
                placeholder="Enter passport number" 
                value={formData.passportnumber}
                onChange={(e) => handleInputChange('passportnumber', e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <Input 
                label="Sex" 
                type="text" 
                id="sex" 
                placeholder="Enter sex" 
                value={formData.sex}
                onChange={(e) => handleInputChange('sex', e.target.value)}
              />
            </div>
          </div>

          {/* ANCHOR: Fourth Row - Nationality & Date of Birth */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input 
                label="Nationality" 
                type="text" 
                id="nationality" 
                placeholder="Enter nationality" 
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <Input 
                label="Date of birth" 
                type="date" 
                id="dateofbirth" 
                placeholder="Enter date of birth" 
                value={formData.dateofbirth}
                onChange={(e) => handleInputChange('dateofbirth', e.target.value)}
              />
            </div>
          </div>

          {/* ANCHOR: Fifth Row - Place of Birth & Date of Issue */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Input 
                label="Place of birth" 
                type="text" 
                id="placeofbirth" 
                placeholder="Enter place of birth" 
                value={formData.placeofbirth}
                onChange={(e) => handleInputChange('placeofbirth', e.target.value)}
              />
            </div>
            <div className={styles.formField}>
              <Input 
                label="Date of Issue" 
                type="date" 
                id="dateofissue" 
                placeholder="Enter date of issue" 
                value={formData.dateofissue}
                onChange={(e) => handleInputChange('dateofissue', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile