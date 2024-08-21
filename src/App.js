import './App.css';
import Form from '@rjsf/mui';
import { createRef } from 'react';
import validator from '@rjsf/validator-ajv8';
import React, { useState } from 'react';
import JsonView from 'react18-json-view'
import Card from 'react-bootstrap/Card';
import 'react18-json-view/src/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSubmitButtonOptions } from '@rjsf/utils';

function App() {

  const [name, setName] = useState('');
  const [schema, setSchema] = useState('{}');
  const [jsonData, setJsonData] = useState('')


  const onChange = ({ formData }) => {if(formData !== undefined){setJsonData(JSON.parse(JSON.stringify(formData)))}}
  const onSubmit = ({ formData }) => alert("Data is valid.");

  const formRef = createRef();

  async function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    console.log(name)

    const url = "https://typeapi.lab.pidconsortium.net/v1/types/schema/" + name;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      delete json['$schema']
      setSchema(json)
      console.log(schema)
    } catch (error) {
      console.error(error.message);
    }
  }

  function SubmitButton(props) {
    const { uiSchema } = props;
    const { norender } = getSubmitButtonOptions(uiSchema);
    if (norender) {
      return null;
    }
    return (
      <button type='submit'>
        Validate
      </button>
    );
  }

  return ( 
    <div className='wrapper'>
      <h3>Create JSON Object from Type PID</h3>
      <hr/>
      <div className='textbar'>
        <form onSubmit={handleSubmit}>
          <input className='typeInput' onChange = {(e) => setName(e.target.value)} value = {name} placeholder='Enter Type PID'></input>
          <button >Generate</button>
        </form>
      </div>
      <div className = "formEditorDiv">
        {schema !== "{}" &&
        <div>
          <Form
            id="formEditor"
            schema={schema}
            validator={validator}
            experimental_defaultFormStateBehavior={{
              arrayMinItems: { populate: 'requiredOnly' },
            }}
            onChange={onChange}
            onSubmit={onSubmit}
            onError={log('errors')}
            ref={formRef}
            templates={{ ButtonTemplates: { SubmitButton } }}
          />
          <div>
          <br/><br/><br/>
          <h3>JSON Object</h3>
          <Card>
            <JsonView src={jsonData} />
          </Card>
          <br/>
        </div>
          </div>
        }
      </div>
    </div>
  );
}

  export default App;

  const log = (type) => console.log.bind(console, type);
