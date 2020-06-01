import * as React from 'react';
import {
  useDropzone,
  DropzoneProps,
} from 'react-dropzone';

import styles from '../styles.module.css';

/**
 * Was gonna use Dropzone for uploading, then decided to use Microblink web component
 */

export interface FileInputProps extends DropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const fileNames = (arr: File[]) => arr.map((file) => file.name);

export const FileInput: React.FC<FileInputProps> = ({ onFilesSelected }) => {

  const onDrop = React.useCallback((files) => {
    onFilesSelected(files);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, acceptedFiles } =
    useDropzone({ onDrop, multiple: false, maxSize: 5242880, accept: ['image/jpg', 'image/jpeg'] });

  return (
    <div className={styles.formField} {...getRootProps()}>
      <input {...getInputProps()} />
      {acceptedFiles && acceptedFiles.length
        ? fileNames(acceptedFiles).toString()
        : 'Drag the back photo of you ID card here.'
      }
    </div>
  );
};