import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';

import { defaultPayload } from '../lib/defaultPayload';

const Create = () => {
  /// hooks ///
  const navigate = useNavigate();

  /// state ///
  const [clientId, setClientId] = useState('6ff20eb7-e80d-4452-b45f-2ea7e63547aa');
  const [payload, setPayload] = useState(defaultPayload);

  /// handlers ///
  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'clientId':
        setClientId(value);
        break;
      case 'payload':
        setPayload(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let now = Date.now();

    // NOTE
    // This is used for creating an adhoc individual client and ping combo. Each
    // time that you run this it will replace the existing doc with this client
    // ID rather than continuously pushing and storing single tests.
    //
    // If you don't pass a `debugId` below the entire row will be empty besides
    // the date, and you won't be able to click and see your ping.
    await updateDoc(doc(getFirestore(), 'clients', clientId), {
      // You must update this to see your ping in the debug viewer.
      debugId: '',
      lastActive: now
    });

    await addDoc(collection(getFirestore(), 'pings'), {
      clientId,
      payload: payload.replace('{{CLIENT_ID}}', clientId),
      addedAt: now
    })
      .then(() => {
        setClientId('');
        setPayload('');

        // new ping has been added, go back to the home page
        navigate('/');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };

  /// render ///

  // TODO
  // - Add instructions on how to use this.
  // - Redirect this route if in `prod` environment.
  return (
    <div className='container'>
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Add ping</h3>
        </div>
        <div className='panel-body'>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label>
                Client ID:
                <input
                  type='text'
                  className='form-control'
                  name='clientId'
                  value={clientId}
                  onChange={onChange}
                  placeholder='clientId'
                />
              </label>
            </div>
            <div className='form-group'>
              <label>
                Payload:
                <textarea
                  className='form-control'
                  name='payload'
                  onChange={onChange}
                  placeholder='payload'
                  cols='80'
                  rows='10'
                  value={payload}
                />
              </label>
            </div>
            <button type='submit' className='btn btn-success'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
