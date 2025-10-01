import React from 'react'
import styles from './scss/_residencies.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { ResidenciesFunction } from './ResidenciesFunction'
import Input from '@/reusable/Input'
import Button from '@/reusable/Button'
import { Plus, ArrowLeft, ArrowRight, House } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getIdentity } from '../../../services/ii'

const Residencies = () => {
    const {
        navigate,
        handleNavigateToStep,
        isEditing,
        handleSaveResidency,
        handleEditResidency,
        primaryResidence,
        otherAddresses,
        addAddress,
        updateAddress,
        removeAddress,
        updatePrimaryResidence,
    } = ResidenciesFunction();

    const [isUpdating, setIsUpdating] = useState(null)
    const [storedResidenciesData, setStoredResidenciesData] = useState({})

    useEffect(() => {
        const data = localStorage.getItem('residenciesData')
        if (data) {
            try {
                const parsed = JSON.parse(data)
                setStoredResidenciesData(parsed)
                if (parsed.primaryResidence) {
                    updatePrimaryResidence(parsed.primaryResidence)
                }
                if (parsed.otherAddresses) {
                    parsed.otherAddresses.forEach(addr => {
                        updateAddress(addr.id, addr.value)
                    })
                }
            } catch {
                setStoredResidenciesData({})
            }
        }
    }, [])

      const handleNext = async () => {
        setIsUpdating(true)
          try {
                const auth = await getIdentity()
    
                const { identity: userIdentity, authenticatedActor } = auth

                const otherAddresses2 = otherAddresses.map(addr =>
                    typeof addr === 'string' ? addr : addr.value
                )

                console.log(primaryResidence, otherAddresses2)
    
                const userdata = await authenticatedActor.update_user_residencies(primaryResidence, otherAddresses2)
                
    
                if (userdata.Ok) {
                    localStorage.setItem(
                        'residenciesData',
                        JSON.stringify({ primaryResidence, otherAddresses })
                    )
                    navigate('/wizard/upload-file')
                }
                
            } catch(err) {
                console.log(err)
            } finally {
                setTimeout(() => 
                    setIsUpdating(false), 800
                )
            }
      }

    return (
        <div className={styles.residenciesContainer}>
            <div className={styles.header}>

                <p className={styles.superTitle}>Complete your passport</p>
                <p className={styles.title}>
                    Add residencies
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            {isEditing ? (
                <div className={styles.residenciesContent}>
                    <p> We’ve captured you primary residence </p>

                    <div className={styles.residenciesInput}>
                        <Input
                            label="Primary Residence"
                            type="text"
                            placeholder="Enter your residence"
                            value={primaryResidence}
                            onChange={(e) => updatePrimaryResidence(e.target.value)}
                        />
                    </div>

                    <p className={styles.residenciesDescription}>
                        If you have other addresses that are significant for your Relationship Passport, add them here — such as additional tax residencies, long-term stays abroad, or other important residences.
                    </p>

                    {/* ANCHOR: Dynamic address inputs */}
                    {otherAddresses.map((address, index) => (
                        <div key={address.id} className={styles.otherResidenciesInput}>
                            <Input
                                label={index === 0 ? "Other residences" : ""}
                                type="text"
                                placeholder="Address"
                                value={address.value}
                                onChange={(e) => updateAddress(address.id, e.target.value)}
                            />
                        </div>
                    ))}

                    <div className={styles.addOtherResidency} onClick={addAddress}>
                        <Plus />
                        Add
                    </div>


                </div>
            ) : (
                <div className={styles.editResidency}>
                    <div className={styles.primaryResidence}>
                        <div className={styles.primaryResidenceHeader}>
                            <House />
                            <p>Primary Residence</p>
                        </div>
                        <div>
                            <p>{primaryResidence}</p>
                        </div>
                    </div>
                    <div className={styles.otherResidencies}>
                        <div className={styles.otherResidenciesHeader}>
                            <div className={styles.otherResidenciesHeaderTitle}>
                                <House />
                                <p>Other Residencies</p>
                            </div>
                            <button
                                className={styles.editButton}
                                onClick={handleEditResidency}
                            >
                                Edit
                            </button>
                        </div>
                        {otherAddresses.filter(addr => addr.value.trim() !== '').map((address, index) => (
                            <div key={address.id} className={styles.otherResidenciesItem}>
                                <p>{address.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className={styles.residenciesButton}>
                {
                    isEditing ? (
                        <Button
                            variant="primary"
                            onClick={handleSaveResidency}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={isUpdating}>
                                {isUpdating ? ('Updating') : ('Save')}
                        </Button>
                    )
                }
            </div>

            {/* Navigation Buttons */}
            <div className={styles.nationalitiesButton}>
                <div className={styles.nationalitiesButtonDual}>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualLeft}
                        onClick={() => navigate('/wizard/nationalities')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/upload-file')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default Residencies