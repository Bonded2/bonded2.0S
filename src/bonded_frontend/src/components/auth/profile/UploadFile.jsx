import React, { useState, useEffect } from 'react';
import styles from './scss/_uploadfile.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { UploadFileFunction } from './UploadFileFunction'
import { Heart, Plus, DollarSign, Droplet, ThumbsUp, ArrowLeft, ArrowRight, File as FileIcon, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import Button from '@/reusable/Button';
import Input from '@/reusable/Input';
import { useNavigate } from 'react-router-dom';
import Minicalendar from '@/reusable/Minicalendar';
import InlineSelect from '@/reusable/InlineSelect';
import { getIdentity } from '../../../services/ii';
import Checkbox from '@/reusable/Checkbox';

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

  return canvas.toDataURL('image/jpeg', quality)
}

const UploadFile = () => {
  const {
    navigate,
    chooseFile,
    setChooseFile,
    hasContinued,
    setHasContinued,
    selectedFileType,
    setSelectedFileType,
    selectedCountryCode,
    setSelectedCountryCode,
    selectedFile,
    setSelectedFile,
    openDropdowns,
    setOpenDropdowns,
    selectedDateRange,
    setSelectedDateRange,
    showCalendar,
    setShowCalendar,
    calendarRef,
    fileList: fileListData,
    documentType,
    countryOfIssue,
    handleFileSelect,
    handleFileTypeClick,
    handleDateRangeSelect,
    handleNavigateToStep,
    handleDropdownToggle,
    closeAllDropdowns,
    handleRemoveLastFile,
    formatDate,
    formatDateRange,
    formatPrettyDateRange,
    uploadedFiles,
  } = UploadFileFunction();

  // Map icon strings to actual components
  const iconMap = {
    Heart: <Heart />,
    DollarSign: <DollarSign />,
    Droplet: <Droplet />,
    ThumbsUp: <ThumbsUp />,
  };

  const [isUpdating, setIsUpdating] = useState(null)
  const [storedFiles, setStoredFiles] = useState([])
  const [storedFileName, setStoredFileName] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('uploadedFiles')
    if (stored) {
      try {
        setStoredFiles(JSON.parse(stored))
      } catch {
        setStoredFiles([])
      }
    }
  }, [])

  const handleContinue = async () => {
    setIsUpdating(true)
    if (!selectedFile) return

    try {
      let fileToCompress = selectedFile.file || selectedFile

      if (typeof selectedFile === 'string') {
        fileToCompress = dataURLtoBlob(selectedFile)
      }

      const auth = await getIdentity()

      const { identity: userIdentity, authenticatedActor } = auth

      const compressed = await compressImage(fileToCompress)
      const byteString = atob(compressed.split(',')[1])
      const byteArray = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i)
      }

      const formatFileMetaString = (fileType, countryCode, dateRange) => {
        const type = fileType || "UnknownType";
        const country = countryCode || "UnknownCountry";

        const start = dateRange?.start ? new Date(dateRange.start).toLocaleDateString() : "N/A";
        const end = dateRange?.end ? new Date(dateRange.end).toLocaleDateString() : "N/A";

        return `${type} | ${country} | ${start} - ${end}`;
      };

      const metaString = formatFileMetaString(selectedFileType, selectedCountryCode, selectedDateRange)

      const fileData = await authenticatedActor.update_user_documents(metaString, [Array.from(byteArray)])
      // Save file metadata
      const newFile = {
        fileName: selectedFile.name,
        data: compressed,
        fileType: selectedFileType,
        countryCode: selectedCountryCode,
        dateRange: selectedDateRange
      }

      const updatedFiles = [...storedFiles, newFile]
      setStoredFiles(updatedFiles)
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles))

      // Reset current selection
      setSelectedFile(null)
      setChooseFile(false)
      setHasContinued(true)

    } catch (err) {
      console.error('Compression error:', err)
      alert('Failed to process photo. Please try again.')
    } finally {
      setTimeout(() =>
        setIsUpdating(false), 800
      )
    }
  }


  const fileList = fileListData.map(item => ({
    ...item,
    icon: iconMap[item.icon]
  }));

  return (
    <div className={styles.uploadFileContainer}>
      <div className={styles.header}>

        <p className={styles.superTitle}>Complete your passport</p>
        <p className={styles.title}>
          Upload your files
        </p>

        <DotsWizard
          classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
          onNavigate={handleNavigateToStep}
        />
      </div>

      {chooseFile && !hasContinued ? (
        <div className={styles.selectedFile}>
          <div className={styles.selectedFileHeader}>
            <p>If you have important documents that aren't available as digital records, you can upload them here to keep your profile complete. Accepted formats include JPG and PNG with a max file size of 10MB per file</p>
          </div>

          <div className={styles.selectedFileContentContainer}>

            {/* Selected File Content */}
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
                      setSelectedFile(null);
                      setChooseFile(false);
                      const input = document.getElementById('global-file-input');
                      if (input) input.value = '';
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
                  placeholder="Select a file type"
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
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                      // Auto scroll to the date picker section
                      setTimeout(() => {
                        const datePickerElement = document.querySelector(`.${styles.datePickerContainer}`);
                        if (datePickerElement) {
                          datePickerElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }
                      }, 100);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowCalendar(!showCalendar);
                        // Auto scroll to the date picker section
                        setTimeout(() => {
                          const datePickerElement = document.querySelector(`.${styles.datePickerContainer}`);
                          if (datePickerElement) {
                            datePickerElement.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center'
                            });
                          }
                        }, 100);
                      }
                    }}
                  >
                    <span className={styles.dateDisplay}>
                      {selectedDateRange.start && selectedDateRange.end
                        ? formatDateRange(selectedDateRange)
                        : 'mm/dd/yyyy'}
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
        </div>
      ) : hasContinued ? (
        <div className={styles.uploadedFileDisplay}>
          <div className={styles.uploadedFileHeader}>
            <p>If you have important documents that aren't available as digital records, you can upload them here to keep your profile complete. Accepted formats include JPG, PNG with a max file size of 10MB per file</p>
          </div>
          <div className={styles.uploadedFileCard}>
            <div className={styles.uploadedFileInfo}>
              <div className={styles.uploadedFileInfoHeader}>
                <div className={styles.uploadedFileIcon}>
                  <Heart size={24} />
                </div>
                <div className={styles.uploadedFileName}>
                  {(() => {
                    const lastUploadedFile = uploadedFiles.files[uploadedFiles.files.length - 1];
                    const fileType = lastUploadedFile?.fileType || selectedFileType;
                    return documentType.find(doc => doc.code === fileType)?.name || 'Document';
                  })()}
                </div>
                <button
                  type="button"
                  className={styles.uploadedFileRemove}
                  onClick={handleRemoveLastFile}
                >
                  Remove
                </button>
              </div>
              <div className={styles.uploadedFileDetails}>
                <div className={styles.uploadedFileMeta}>
                  <span className={styles.uploadedFileDate}>
                    Issued: {(() => {
                      const lastUploadedFile = uploadedFiles.files[uploadedFiles.files.length - 1];
                      const dateRange = lastUploadedFile?.dateRange || selectedDateRange;
                      return dateRange?.start ? formatPrettyDateRange(dateRange) : 'Not specified';
                    })()}
                  </span>
                  <span className={styles.uploadedFileCountry}>
                    Issuing Country: {(() => {
                      const lastUploadedFile = uploadedFiles.files[uploadedFiles.files.length - 1];
                      const countryCode = lastUploadedFile?.countryCode || selectedCountryCode;
                      return countryOfIssue.find(country => country.code === countryCode)?.name || 'Not specified';
                    })()}
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
              checked={false}
              onChange={() => { }}
            />
          </div>

          <div className={styles.uploadedFileLegalText}>
            <p>Legal documents will not appear in your story. They are only available on your Home screen</p>
          </div>

          <div className={styles.uploadedFileButton}>
            <Button
              variant="primary"
              onClick={() => {
                navigate('/wizard/complete-profile');
              }}
            >
              Next
            </Button>
          </div>

        </div>
      ) : (

        <>
          <div className={styles.uploadFileContent}>
            <div>
              <p>
                Upload any documents that help prove your relationship, and we'll add them as stamps in your Relationship Passport.
              </p>
            </div>
            <div>
              <p>
                These could be marriage certificates, bank statements, utility bills, or other records. Don't worry if you don't have everything at hand, you can always return later to add more or update existing documents.
              </p>
            </div>
            <div>
              <p>Accepted formats: JPG and PNG (max 10MB per file).</p>
            </div>
          </div>

          <div className={styles.fileList}>
            {fileList.map((item, index) => (
              <div
                className={styles.fileItem}
                key={index}
                onClick={() => handleFileTypeClick(item.type)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.fileItemIcon}>{item.icon}</div>
                <div className={styles.fileItemTitle}>{item.title}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upload Button - Only show when no file is selected and not continued */}
      {!chooseFile && !hasContinued && (
        <div className={styles.uploadFileButton}>
          <Button
            variant="primary"
            onClick={() => {
              const fileInput = document.getElementById('global-file-input');
              if (fileInput) fileInput.click();
            }}
          >
            Upload
          </Button>
          <Input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id={'global-file-input'}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {chooseFile && !hasContinued && (
        <div className={styles.uploadFileButton}>
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={isUpdating}
          >
            {isUpdating ? ('Updating') : ('Next')}
          </Button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.nationalitiesButton}>
        <div className={styles.nationalitiesButtonDual}>
          <Button
            variant="secondary"
            className={styles.nationalitiesButtonDualLeft}
            onClick={() => navigate('/wizard/residencies')}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            variant="secondary"
            className={styles.nationalitiesButtonDualRight}
            onClick={() => navigate('/wizard/complete-profile')}
          >
            Skip
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;