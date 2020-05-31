import * as React from 'react';
import { Form } from 'react-final-form';

import { BaseForm } from './component/BaseForm';
import { FileInput } from './component/FileInput';

import styles from './styles.module.css';

const url = 'https://api.microblink.com/recognize/execute​';
const apiSecret = '4943ce8e-21b5-4c82-808c-7f80c0ccbe87';
const apiKey = '197d408f3ac34985a7fb7e7926c56f9d';
const token = 'Bearer MTk3ZDQwOGYzYWMzNDk4NWE3ZmI3ZTc5MjZjNTZmOWQ6NDk0M2NlOGUtMjFiNS00YzgyLTgwOGMtN2Y4MGMwY2NiZTg3';

export class OCRForm extends React.Component<any> {

  render() {
    return (
      <div className={styles.container}>
        <FileInput onFilesSelected={this.onFileSelected} />
        <br/>
        <Form component={BaseForm} onSubmit={this.onSubmit} />
      </div>

    )
  }

  private onFileSelected = async (files: string[]) => {
    console.log(files);
    const response = await fetch(url, {
      method: 'POST',
      body: files[0],
      headers: {
        Authorization: token,
      }
    });

    const body = await response.json();

    console.log(body);
  }

  private onSubmit = () => {

  }
}