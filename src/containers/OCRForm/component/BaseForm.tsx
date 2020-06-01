import * as React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import styles from '../styles.module.css';

export interface IBaseFormProps {
  handleSubmit: () => void;
  form: any;
  submitting: boolean;
  pristine: boolean;
}

export const BaseForm: React.FC<FormRenderProps> = (props) => {

  return (
    <form className={styles.baseForm} >
      <Field name='firstName' title='Firstname' component='input' placeholder='Firstname' />
      <Field name='lastName' component='input' placeholder='Lastname' />
      <Field name='dob' component='input' placeholder='Date of birth' />
      <Field name='docNo' component='input' placeholder='Document number' />
      <Field name='expirationDate' component='input' placeholder='Expiration date' />
      <Field name='oib' component='input' placeholder='OIB' />
      <Field name='gender' component='input' placeholder='Gender' />
      <Field name='nationality' component='input' placeholder='Nationality' />
    </form>
  );
}