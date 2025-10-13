

export const ExportFunction = () => {


    const exportData = [
        {
            id: 1,
            title: 'StoryMaker',
            content: "Create quick, curated snapshots of your data. Perfect for border checks, case officer updates, or interim reports. The app tailors the view so you don't have to.",
            link: '/dashboard/story-maker'
        },
        {
            id: 2,
            title: 'ApplicationMaker',
            content: "Build complete immigration applications. Choose your country and Visa type, the app compares requirements with your data to build a full application or extract what you need.",
            link: '/dashboard/application-maker'
        },
        {
            id: 3,
            title: 'Custom Export',
            content: "Take full control of your data. Select exactly what to export and in what format without automatic curation.",
            link: '/dashboard/custom-export'
        }
    ];


    return {
        data: exportData
    }
}