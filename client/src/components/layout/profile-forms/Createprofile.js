import React, { Fragment, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createnewprofile } from '../../../actions/profile'
const Createprofile = ({ createnewprofile, history }) => {
  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  })
  const [displaysocialmedia, togglesocialmedia] = useState(false)

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    linkedin,
    twitter,
    facebook,
    instagram,
    youtube,
  } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const onSubmit = (e) => {
    e.preventDefault()
    createnewprofile(formData, history, false)
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Create Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <select
            name='status'
            value={status}
            onChange={(e) => onChange(e)}
            style={{ outline: 'none', borderRadius: '10px' }}
          >
            <option value='0'>* Select Professional Status</option>
            <option value='Developer'>Developer</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student or Learning'>Student or Learning</option>
            <option value='Instructor'>Instructor or Teacher</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Company'
            name='company'
            onChange={(e) => onChange(e)}
            value={company}
            style={{ outline: 'none', borderRadius: '10px' }}
          />
          <small className='form-text'>
            Could be your own company or one you work for
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Website'
            name='website'
            onChange={(e) => onChange(e)}
            value={website}
            style={{ outline: 'none', borderRadius: '10px' }}
          />
          <small className='form-text'>
            Could be your own or a company website
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            name='location'
            value={location}
            onChange={(e) => onChange(e)}
            style={{ outline: 'none', borderRadius: '10px' }}
          />
          <small className='form-text'>
            City and state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Skills'
            name='skills'
            value={skills}
            onChange={(e) => onChange(e)}
            style={{ outline: 'none', borderRadius: '10px' }}
          />
          <small className='form-text'>
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Github Username'
            name='githubusername'
            value={githubusername}
            onChange={(e) => onChange(e)}
            style={{ outline: 'none', borderRadius: '10px' }}
          />
          <small className='form-text'>
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            onChange={(e) => onChange(e)}
            value={bio}
            style={{ outline: 'none', borderRadius: '10px' }}
          ></textarea>
          <small className='form-text'>Tell us a little about yourself</small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => togglesocialmedia(!displaysocialmedia)}
            type='button'
            className='btn btn-light'
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>
        {displaysocialmedia && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x'></i>
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={(e) => onChange(e)}
                onChange={(e) => onChange(e)}
                style={{ outline: 'none', borderRadius: '10px' }}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x'></i>
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={(e) => onChange(e)}
                style={{ outline: 'none', borderRadius: '10px' }}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x'></i>
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={(e) => onChange(e)}
                style={{ outline: 'none', borderRadius: '10px' }}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x'></i>
              <input
                type='text'
                placeholder='Linkedin URL'
                name='linkedin'
                onChange={(e) => onChange(e)}
                value={linkedin}
                style={{ outline: 'none', borderRadius: '10px' }}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x'></i>
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                onChange={(e) => onChange(e)}
                value={instagram}
                style={{ outline: 'none', borderRadius: '10px' }}
              />
            </div>
          </Fragment>
        )}

        <a
          onClick={onSubmit}
          type='submit'
          className='btn btn-primary my-1'
          style={{ outline: 'none', borderRadius: '5px' }}
        >
          Submit
        </a>
        <a className='btn btn-light my-1' href='dashboard.html'>
          Go Back
        </a>
      </form>
    </Fragment>
  )
}

Createprofile.propTypes = {
  createnewprofile: PropTypes.func.isRequired,
}

export default connect(null, { createnewprofile })(withRouter(Createprofile)) // to use history object
