import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getGithubRepos, getAllProfiles } from '../../actions/profile'

const ProfileGithub = ({ getGithubRepos, username, repos }) => {
  useEffect(() => {
    getGithubRepos(username)
  }, [getGithubRepos])
  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>Github Repos</h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map((repos) => (
          <div key={repos._id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repos.html_url}
                  target='_blank'
                  rel='noopener noreferrer '
                >
                  {repos.name}
                </a>
              </h4>
              <p>{repos.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars:{repos.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers:{repos.watchers_count}
                </li>
                <li className='badge badge-light'>Forks:{repos.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

ProfileGithub.propTypes = {
  repos: PropTypes.array.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
})
export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub)
