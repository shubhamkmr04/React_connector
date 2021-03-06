import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, password, password2, email } = formData // extracting value from formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('password not matched', 'danger')
    } else {
      // const newUser = {
      //   name,
      //   email,
      //   password,
      // }
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      //   const body = JSON.stringify(newUser)
      //   const res = await axios.post('api/users', body, config)
      //   console.log(res.data)
      // } catch (err) {
      //   console.error(err.response.data)
      // }
      register({ name, email, password })
    }
  }
  if (isAuthenticated) {
    return <Redirect to='dashboard' /> //but this has to be private with that particular user's data
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            style={{ outline: 'none', borderRadius: '10px' }}
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            // required //client side verification
          />
        </div>
        <div className='form-group'>
          <input
            style={{ outline: 'none', borderRadius: '10px' }}
            type='email'
            placeholder='Email Address'
            value={email}
            name='email'
            onChange={(e) => onChange(e)}
            // required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            style={{ outline: 'none', borderRadius: '10px' }}
            type='password'
            placeholder='Password'
            name='password'
            onChange={(e) => onChange(e)}
            minLength='6'
            value={password}
          />
        </div>
        <div className='form-group'>
          <input
            style={{ outline: 'none', borderRadius: '10px' }}
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            // minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { setAlert, register })(Register)
