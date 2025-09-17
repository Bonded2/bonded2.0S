import React from 'react'
import styles from './scss/_nationalities.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import Dropdown from '@/reusable/Dropdown'
import { Plus, ArrowLeft, ArrowRight, Flag } from 'lucide-react';
import Button from '@/reusable/Button';
import { NationalitiesFunction } from './NationalitiesFunction';

const Nationalities = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedNationality,
    isSaved,
    handleNavigateToStep,
    handleNationalitySelect,
    handleSave,
    handleEdit,
    country,
    navigate
  } = NationalitiesFunction();

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
            <Dropdown
              options={country}
              value={searchTerm}
              onChange={setSearchTerm}
              onSelect={handleNationalitySelect}
              placeholder="Search"
              searchable={true}
              className={styles.searchBar}
              maxHeight="200px"
              showSearchIcon={true}
              showLeftFlag={false}
            />

            <button type="button" className={styles.addNationalityButton}
              onClick={handleSave}>
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
              <span className={styles.savedNationalityName}>
                {selectedNationality.name}
              </span>
            </div>
          </div>
        )}

        {
          isSaved ? (

            <Button
              variant="primary"
              className={styles.nationalitiesButton}
              onClick={() => navigate('/wizard/residencies')}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              className={styles.nationalitiesButton}
              onClick={handleSave}
              disabled={!selectedNationality || !selectedNationality.name}
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