import React, { useState } from 'react'

export const StoryMakerFunction = () => {
    const payment = [
        {
            id: 1,
            title: 'One Time Payment',
            money: '$29.99',
            description: 'Lorem ipsum dolor sit amet consectetur. Mattis venenatis hac nibh ut non ultrices quam.',
        }
    ]

    // Mock date items for the export UI
    const dateItems = [
        {
            id: 'export_personal',
            label: 'Export your data',
            description: 'This will only export data related to you. No partner approval is needed.'
        },
        {
            id: 'export_relationship',
            label: 'Export relationship data',
            description: 'This will export all data to do with your relationship. This will require partner approval.'
        }
    ]

    const [values, setValues] = useState({
        export_personal: true,
        export_relationship: false
    })

    const handleToggleChange = (nextValues) => {
        // simple passthrough update — caller expects (nextValues, { id, value }) signature
        setValues(nextValues)
    }

    return {
        data: payment,
        dateItems,
        values,
        handleToggleChange
    }
}