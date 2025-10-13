import React from 'react'
import styles from './scss/_upload.module.scss'
import Breadcrumb from '@/reusable/Breadcrumb'
import Button from '@/reusable/Button'
import Input from '@/reusable/Input'
import InlineSelect from '@/reusable/InlineSelect'
import Minicalendar from '@/reusable/Minicalendar'
import Checkbox from '@/reusable/Checkbox'
import { File as FileIcon, ChevronUp, ChevronDown, Calendar, Plus, Heart } from 'lucide-react'
import { useUploadFunction } from './UploadFunction'
import { useUploadPhoto } from './UploadphotoFunction'

const Upload = () => {
    const {
        chooseFile,
        setChooseFile,
        selectedFileType,
        setSelectedFileType,
        selectedCountryCode,
        setSelectedCountryCode,
        selectedFile,
        openDropdowns,
        selectedDateRange,
        setSelectedDateRange,
        showCalendar,
        setShowCalendar,
        calendarRef,
        hasContinued,
        isLegalDocument,
        setIsLegalDocument,
        documentType,
        countryOfIssue,
        handleFileSelect,
        handleDateRangeSelect,
        handleDropdownToggle,
        handleContinue,
        handleRemoveFile,
        handleUploadFiles,
        formatDateRange,
        formatPrettyDateRange,
    } = useUploadFunction()

    const { handlePhotoUpload } = useUploadPhoto()

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
    ]

    return (
        <div className={styles.uploadContainer}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <p className={styles.headerTitle}>Upload Files</p>
            </div>

            {!chooseFile && !hasContinued ? (
                // ANCHOR: First screen - Initial upload button (Image 1)
                <div className={styles.uploadContent}>
                    <p>Upload any files as evidence of your relationship. Accepted formats: PDF, JPG, PNG (max 10MB per file).</p>

                    <div className={styles.uploadFileButton}>
                        <Button
                            variant="primary"
                            onClick={() => {
                                const fileInput = document.getElementById('upload-file-input');
                                if (fileInput) fileInput.click();
                            }}
                        >
                            Upload
                        </Button>
                        <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileSelect}
                            className={styles.fileInput}
                            id={'upload-file-input'}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            ) : chooseFile && !hasContinued ? (
                // ANCHOR: Second screen - File details form (Image 2)
                <div className={styles.selectedFile}>
                    <div className={styles.selectedFileHeader}>
                        <p>Accepted formats include PDF, JPG, PNG with a max file size of 10MB per file</p>
                    </div>

                    <div className={styles.selectedFileContentContainer}>
                        {/* ANCHOR: Selected File Content */}
                        <div className={styles.selectedFileContent}>
                            {selectedFile && (
                                <div className={styles.selectedFileRow}>
                                    <div className={styles.selectedFileInfo}>
                                        <span className={styles.selectedFileIcon}><FileIcon size={18} /></span>
                                        <span className={styles.selectedFileName}>{selectedFile.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.selectedFileRemove}
                                        onClick={() => {
                                            handleRemoveFile();
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.dropdownContainer}>
                            <div>
                                <p>Document type</p>
                                <InlineSelect
                                    options={documentType}
                                    value={selectedFileType}
                                    onChange={(code) => setSelectedFileType(code)}
                                    placeholder="Select document"
                                    showChevron={true}
                                    upIcon={<ChevronUp size={18} />}
                                    downIcon={<ChevronDown size={18} />}
                                    isOpen={openDropdowns.docType || false}
                                    onOpenChange={(next) => handleDropdownToggle('docType', next)}
                                    showRightCode={false}
                                    inlineList={true}
                                    asButton={true}
                                    allowMultipleOpen={true}
                                />
                            </div>

                            <div>
                                <p>Country of issue</p>
                                <InlineSelect
                                    options={countryOfIssue}
                                    value={selectedCountryCode}
                                    onChange={(code) => setSelectedCountryCode(code)}
                                    placeholder="Select country"
                                    showChevron={true}
                                    upIcon={<ChevronUp size={18} />}
                                    downIcon={<ChevronDown size={18} />}
                                    isOpen={openDropdowns.country || false}
                                    onOpenChange={(next) => handleDropdownToggle('country', next)}
                                    showRightCode={false}
                                    inlineList={true}
                                    asButton={true}
                                    allowMultipleOpen={true}
                                />
                            </div>

                            <div>
                                <p>Date of issue</p>
                                <div className={styles.datePickerContainer} ref={calendarRef}>
                                    <div
                                        className={styles.datePickerInput}
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <span className={styles.dateDisplay}>
                                            {selectedDateRange.start && selectedDateRange.end
                                                ? formatDateRange(selectedDateRange)
                                                : 'DD/MM/YYYY'}
                                        </span>
                                        <Calendar size={18} className={styles.calendarIcon} />
                                    </div>
                                    {showCalendar && (
                                        <div className={styles.calendarWrapper}>
                                            <Minicalendar
                                                mode="range"
                                                value={{
                                                    start: selectedDateRange?.start ? new Date(selectedDateRange.start) : null,
                                                    end: selectedDateRange?.end ? new Date(selectedDateRange.end) : null,
                                                }}
                                                onChange={setSelectedDateRange}
                                                onApply={handleDateRangeSelect}
                                                onClear={() => {
                                                    setSelectedDateRange({ start: null, end: null });
                                                    setShowCalendar(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.uploadFileButton}>
                        <Button
                            variant="primary"
                            onClick={handleContinue}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            ) : hasContinued ? (
                <div className={styles.uploadedFileDisplay}>
                    <div className={styles.uploadedFileHeader}>
                        <p>Accepted formats include PDF, JPG, PNG with a max file size of 10MB per file</p>
                    </div>

                    <div className={styles.uploadedFileCard}>
                        <div className={styles.uploadedFileInfo}>
                            <div className={styles.uploadedFileInfoHeader}>
                                <div className={styles.uploadedFileIcon}>
                                    <Heart size={24} />
                                </div>
                                <div className={styles.uploadedFileName}>
                                    {documentType.find(doc => doc.code === selectedFileType)?.name || 'Document'}
                                </div>
                                <button
                                    type="button"
                                    className={styles.uploadedFileRemove}
                                    onClick={handleRemoveFile}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className={styles.uploadedFileDetails}>
                                <div className={styles.uploadedFileMeta}>
                                    <span className={styles.uploadedFileDate}>
                                        Issued: {selectedDateRange?.start ? formatPrettyDateRange(selectedDateRange) : 'Not specified'}
                                    </span>
                                    <span className={styles.uploadedFileCountry}>
                                        Issuing Country: {countryOfIssue.find(country => country.code === selectedCountryCode)?.name || 'Not specified'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="button" className={styles.uploadedFileAddAnother}
                            onClick={() => { setHasContinued(false); setChooseFile(false); }}>
                            <Plus size={14} />
                            <p>Add additional</p>
                        </button>
                    </div>

                    <div className={styles.uploadedFileCheckbox}>
                        <Checkbox
                            label='This is a Legal Document'
                            required={false}
                            checked={isLegalDocument}
                            onChange={(e) => setIsLegalDocument(e.target.checked)}
                        />
                    </div>

                    <div className={styles.uploadedFileLegalText}>
                        <p>Legal documents will not appear in your story. They are only available on your Home screen</p>
                    </div>

                    <div className={styles.uploadedFileButton}>
                        <Button
                            variant="primary"
                            onClick={handleUploadFiles}
                        >
                            Upload Files
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default Upload