import * as React from 'react';
import { Field, FormRenderProps } from 'react-final-form';

import styles from '../styles.module.css';

export interface IBaseFormProps {
  handleSubmit: () => void;
  form: any;
  submitting: boolean;
  pristine: boolean;
}
export const BaseForm: React.FC<FormRenderProps> = ({ handleSubmit, form, submitting, pristine }) => {

  return (
    <form onSubmit={handleSubmit} >
      <div className={styles.formField}>
        <Field name='firstName' component='input' placeholder='Firstname' />
      </div>
      <div className={styles.formField}>
        <Field name='lastName' component='input' placeholder='Lastname' />
      </div>
      <div className={styles.formField}>
        <Field name='dob' component='input' type='date' placeholder='Date of birth' />
      </div>
      <div className={styles.formField}>
        <Field name='docNo' component='input' placeholder='Document number' />
      </div>
      <div>
        <button type='submit' disabled={submitting}>
          Submit
        </button>
        <button
          type='button'
          onClick={form.reset}
          disabled={submitting || pristine}
        >
          Reset
        </button>
      </div>
    </form>
  );
}