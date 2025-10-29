import {type ChangeEvent, type FormEvent, useState} from "react";

export const LoginPage = () => {

  const [login, setLogin] = useState('')
  const [error, setError] = useState<null | string>(null)
  const [touchStatus, setTouchStatus] = useState<'untouched' | 'touched'>('untouched')
  const [validationStatus, setValidationStatus] = useState<'pending' | 'valid' | 'invalid'>('pending')
  const [modificationStatus, setModificationStatus] = useState<'pristine' | 'dirty'>('pristine')

  const handleChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    if(error) {
      setError(null)
    }
    setModificationStatus('dirty')
    setLogin(e.currentTarget.value)
    if(emailRegex.test(e.currentTarget.value)) {
      setValidationStatus('valid')
      setError(null)
    } else {
      setValidationStatus('invalid')
      setError('incorrect email')
    }
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(emailRegex.test(login)) {
      //loginMutation
    } else {
      setError('Invalid email')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <hr />
      <div>
        <input
          type={'input'}
          value={login}
          onChange={handleChangeLogin}
          onBlur={() => setTouchStatus('touched')}
        />
        {validationStatus === 'invalid' && touchStatus === 'touched' && <span>{error}</span>}
      </div>
      <div>
        <input/>
      </div>
      <button type={'submit'}>Login</button>
    </form>
  );
};