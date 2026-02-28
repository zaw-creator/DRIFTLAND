"use client";

import { useState, useId } from "react";
import styles from "./FileUpload.module.css";

export default function FileUpload({
  file,
  files,
  onChange,
  accept = "image/*,.pdf",
  maxSize = 5,
  multiple = false,
  maxFiles = 1,
}) {
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputId = useId();

  const validateFile = (fileToValidate) => {
    // Check file size (maxSize in MB)
    const maxBytes = maxSize * 1024 * 1024;
    if (fileToValidate.size > maxBytes) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError("");

    if (!multiple) {
      // Single file mode
      if (selectedFiles.length > 0) {
        const selectedFile = selectedFiles[0];
        const validationError = validateFile(selectedFile);

        if (validationError) {
          setError(validationError);
          return;
        }

        onChange(selectedFile);

        // Generate preview for images
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setPreview(null);
        }
      }
    } else {
      // Multiple files mode
      if (selectedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate all files
      for (const file of selectedFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      onChange(selectedFiles);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onChange(multiple ? [] : null);
    setPreview(null);
    setError("");
  };

  const handleRemoveFile = (e, index) => {
    e.preventDefault();
    if (multiple && files) {
      const newFiles = files.filter((_, i) => i !== index);
      onChange(newFiles);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={styles.fileUpload}>
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className={styles.input}
        id={fileInputId}
        multiple={multiple}
      />

      {!multiple && !file && (
        <label htmlFor={fileInputId} className={styles.label}>
          <span className={styles.uploadIcon}>📁</span>
          <span>Choose File</span>
        </label>
      )}

      {!multiple && file && (
        <div className={styles.fileInfo}>
          {preview && (
            <div className={styles.preview}>
              <img src={preview} alt="Preview" />
            </div>
          )}
          <div className={styles.fileDetails}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
          </div>
          <button onClick={handleRemove} className={styles.removeButton}>
            ✕
          </button>
        </div>
      )}

      {multiple && (
        <div className={styles.multipleFiles}>
          <label htmlFor={fileInputId} className={styles.label}>
            <span className={styles.uploadIcon}>📁</span>
            <span>
              Choose Files ({files?.length || 0}/{maxFiles})
            </span>
          </label>

          {files && files.length > 0 && (
            <div className={styles.fileList}>
              {Array.from(files).map((f, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileDetails}>
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>
                      {formatFileSize(f.size)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveFile(e, index)}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
