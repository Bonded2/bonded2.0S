import React from 'react'
import styles from './scss/_nationalities.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import Dropdown from '@/reusable/Dropdown'
import { Plus, ArrowLeft, ArrowRight, Flag, X } from 'lucide-react';
import Button from '@/reusable/Button';
import { NationalitiesFunction } from './NationalitiesFunction';
import { useState, useEffect } from 'react'
import { getIdentity } from '../../../services/ii';
import { selectNationality } from '../../../store/slices/profileSlice';

const Nationalities = () => {
  const {
    dropdowns,
    selectedNationalities,
    isSaved,
    handleNavigateToStep,
    handleNationalitySelect,
    handleAddDropdown,
    handleRemoveDropdown,
    handleSave,
    handleEdit,
    handleSetSearchTerm,
    country,
    navigate
  } = NationalitiesFunction();

  const [isUpdating, setIsUpdating] = useState(null)
  const [storedNationalitiesData, setStoredNationalitiesData] = useState({})

  useEffect(() => {
    const data = localStorage.getItem('nationalitiesData')
    if (data) {
      try {
        setStoredNationalitiesData(JSON.parse(data))
      } catch {
        setStoredNationalitiesData({})
      }
    }
  }, [])

  const handleNext = async () => {
    setIsUpdating(true)
    try {
      const auth = await getIdentity()

      const { identity: userIdentity, authenticatedActor } = auth

      // Join all nationalities with comma
      const nationalitiesString = selectedNationalities.map(n => n.name).join(', ')

      const userdata = await authenticatedActor.update_user_nationality(nationalitiesString)

      if (userdata.Ok) {
        localStorage.setItem(
          'nationalitiesData',
          JSON.stringify({ selectedNationalities })
        )
        navigate('/wizard/residencies')
      }

    } catch (err) {
      console.log(err)
    } finally {
      setTimeout(() =>
        setIsUpdating(false), 800
      )
    }
  }

  return (
    <div className={styles.nationalitiesContainer}>
      <div className={styles.header}>

        <p className={styles.superTitle}>Complete your passport</p>
        <p className={styles.title}>
          Add nationalities
        </p>

        <DotsWizard
          classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
          onNavigate={handleNavigateToStep}
        />
      </div>

      <div className={styles.nationalitiesContent}>
        <p>
          We've captured your nationality as "Indian". Please add any additional nationalities you hold. If you do not have any other nationalities, "skip" this step.
        </p>

        {!isSaved ? (
          <>
            {dropdowns.map((dropdown, index) => (
              <div key={dropdown.id} className={styles.dropdownContainer}>
                {dropdown.selectedNationality ? (
                  <div className={styles.selectedNationalityDisplay}>
                    <span className={styles.selectedCode}>{dropdown.selectedNationality.code}</span>
                    <span className={styles.selectedName}>{dropdown.selectedNationality.name}</span>
                    <button
                      type="button"
                      className={styles.removeNationalityButton}
                      onClick={() => handleRemoveDropdown(dropdown.id)}
                      aria-label="Remove nationality"
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <>
                    <Dropdown
                      options={country}
                      value={dropdown.searchTerm}
                      onChange={(term) => handleSetSearchTerm(dropdown.id, term)}
                      onSelect={(nationality) => handleNationalitySelect(dropdown.id, nationality)}
                      placeholder="Search"
                      searchable={true}
                      className={styles.searchBar}
                      maxHeight="200px"
                      showSearchIcon={true}
                      showLeftFlag={false}
                    />
                    {dropdowns.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeNationalityButton}
                        onClick={() => handleRemoveDropdown(dropdown.id)}
                        aria-label="Remove nationality"
                      >
                        <X />
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            <button type="button" className={styles.addNationalityButton}
              onClick={handleAddDropdown}>
              <Plus />
              Add nationality
            </button>
          </>
        ) : (
          <div className={styles.savedNationality}>
            <div className={styles.savedNationalityHeader}>
              <div className={styles.savedNationalityTitle}>
                <Flag className={styles.flagIcon} />
                <span>Nationalities</span>
              </div>
              <button
                className={styles.editButton}
                onClick={handleEdit}
              >
                Edit
              </button>
            </div>
            <div className={styles.savedNationalityContent}>
              {selectedNationalities.map((nationality, index) => (
                <div key={index} className={styles.savedNationalityItem}>
                  <span className={styles.savedNationalityFlag}>
                    {nationality.flag}
                  </span>
                  <span className={styles.savedNationalityName}>
                    {nationality.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {
          isSaved ? (

            <Button
              variant="primary"
              className={styles.nationalitiesButton}
              onClick={handleNext}
              disabled={isUpdating}>
              {isUpdating ? ('Updating') : ('Next')}
            </Button>
          ) : (
            <Button
              variant="primary"
              className={styles.nationalitiesButton}
              onClick={handleSave}
              disabled={dropdowns.every(d => !d.selectedNationality)}
            >
              Save
            </Button>

          )
        }

        {/* Navigation Buttons */}
        <div className={styles.nationalitiesButton}>
          <div className={styles.nationalitiesButtonDual}>
            <Button
              variant="secondary"
              className={styles.nationalitiesButtonDualLeft}
              onClick={() => navigate('/wizard/profile-photo')}>
              <ArrowLeft />
              Back
            </Button>
            <Button
              variant="secondary"
              className={styles.nationalitiesButtonDualRight}
              onClick={() => navigate('/wizard/residencies')}>
              Skip
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Nationalities