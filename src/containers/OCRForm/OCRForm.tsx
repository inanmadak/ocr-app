import * as React from 'react';
import { Form } from 'react-final-form';

import { parseMRZ } from '../../utils/mrz';
import { BaseForm } from './component/BaseForm';
import { Scanner } from './component/Scanner';

import styles from './styles.module.css';

interface IState {
  fields: {
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
    return (
      <div className={styles.container}>
        <Scanner onResultReady={this.onScanResultReady} onError={this.onScanError} />
        <br/>
        <Form component={BaseForm} onSubmit={this.onSubmit} initialValues={this.state?.fields} />
      </div>
    )
  }

  private onScanResultReady = (results: any) => {
    console.log(results);
    const result = results.data && results.data[0] && results.data[0].result;
    const mrzStr = result.rawMRZString;
    const { doc, personal, identification } = parseMRZ(mrzStr);

    this.setState({
      fields: {
        dob: personal.dob.value,
        oib: doc.oib!,
        expirationDate: personal.expirationDate.value,
        firstName: identification.secondary,
        lastName: identification.primary,
        gender: personal.gender,
        nationality: personal.nationality,
        docNo: doc.docNo,
      }
    });
  }

  private onScanError = (event: any) => {
    console.log(event);
  }

  private onSubmit = () => undefined;
}