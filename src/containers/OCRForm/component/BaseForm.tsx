import * as React from 'react';
import {
  Field,
  FormRenderProps,
} from 'react-final-form';

import styles from '../styles.module.css';

export const BaseForm: React.FC<FormRenderProps> = ({ handleSubmit }) => {

  return (
    <form className={styles.baseForm} onSubmit={handleSubmit}>
      <label>
        <span>Firstname</span>
        <Field name='firstName' component='input' />
      </label>
      <label>
        <span>Lastname</span>
        <Field name='lastName' component='input' />
      </label>
      <label>
        <span>Date of Birth</span>
        <Field name='dob' component='input' />
      </label>
      <label>
        <span>Document No</span>
        <Field name='docNo' component='input' />
      </label >
      <label>
        <span>Document Type</span>
        <Field name='type' component='input' />
      </label>
      <label>
        <span>Issuing State</span>
        <Field name='stateCode' component='input' />
      </label>
      <label>
        <span>Expiration Date</span>
        <Field name='expirationDate' component='input' />
      </label >
      <label>
        <span>OIB</span>
        <Field name='oib' component='input' />
      </label >
      <label>
        <span>Gender</span>
        <Field name='gender' component='input' />
      </label >
      <label>
        <span>Nationality</span>
        <Field name='nationality' component='input' />
      </label >
    </form>
  );
}