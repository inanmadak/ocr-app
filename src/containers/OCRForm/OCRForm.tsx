import * as React from 'react';
import { Form } from 'react-final-form';

import { MRZUtil } from 'utils/mrz';
import { IMRZInfo } from 'utils/mrz/interfaces';

import { BaseForm } from './component/BaseForm';
import { Scanner } from './component/Scanner';
import {
  SCANNER_AUTH_TOKEN,
  SCANNER_RECOGNIZERS,
} from './constants';

import styles from './styles.module.css';
import { printValidation } from './herlpers';

interface IState {
  parsedMRZ: IMRZInfo;
  initialValues: {
    dob: string;
    firstName: string;
    lastName: string;
    oib: string;
    gender: string;
    nationality: string;
    docNo: string;
    expirationDate: string;
  }
}

export class OCRForm extends React.Component<{}, IState> {

  render() {
    const { personal, validated } = (this.state && this.state.parsedMRZ) || {};
    return (
      <div className={styles.container}>
        <Scanner
          recognizers={SCANNER_RECOGNIZERS}
          onResultReady={this.onScanResultReady}
          onError={this.onScanError}
          token={SCANNER_AUTH_TOKEN}
        />
        <div className={styles.colLeft}>
          <Form
            component={BaseForm}
            initialValues={this.state?.initialValues}
            onSubmit={this.onSubmit}
          />
        </div>
        <div className={styles.colRight}>
          Field Validations
          {
            this.state?.parsedMRZ
              ? (
                <>
                  <div>DOB: {printValidation(personal.dob.validated)}</div>
                  <div>Expiration Date: {printValidation(personal.dob.validated)}</div>
                  <div>Composite CD: {printValidation(validated)}</div>
                </>
              )
              : null
          }
        </div>
      </div>
    )
  }

  private onScanResultReady = (results: any) => {
    const result = results.data && results.data[0] && results.data[0].result;
    const mrzStr = result.rawMRZString;
    const parsedMRZ = MRZUtil.parseMRZ(mrzStr);
    const { doc, personal, identification } = MRZUtil.parseMRZ(mrzStr);

    this.setState({
      initialValues: {
        dob: personal.dob.value,
        oib: doc.oib!,
        expirationDate: personal.expirationDate.value,
        firstName: identification.secondary,
        lastName: identification.primary,
        gender: personal.gender,
        nationality: personal.nationality,
        docNo: doc.docNo,
      },
      parsedMRZ
    });
  }

  private onScanError = (event: any) => {
    console.log(event);
  }

  private onSubmit = () => undefined;
}