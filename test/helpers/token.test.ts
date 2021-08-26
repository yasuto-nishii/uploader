import path from 'path'

import * as fileHelpers from '../../src/helpers/files'
import * as tokenHelpers from '../../src/helpers/token'
import { UploaderInputs } from '../../src/types'
import { DEFAULT_UPLOAD_HOST } from '../../src/helpers/constansts'

describe('Get tokens', () => {
  const fixturesDir = path.join(
    fileHelpers.fetchGitRoot(),
    'test/fixtures/yaml',
  )
  const invalidFixturesDir = path.join(
    fileHelpers.fetchGitRoot(),
    'test/fixtures/invalid_yaml',
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('From yaml', () => {
    it('Returns empty with no yaml file', () => {
      const args = {
        flags: '',
        verbose: 'true',
      }
      expect(tokenHelpers.getTokenFromYaml('.', args)).toBe('')
    })

    it('Returns the correct token from file', () => {
      const args = {
        flags: '',
        verbose: 'true',
      }
      expect(tokenHelpers.getTokenFromYaml(fixturesDir, args)).toBe('faketoken')
    })

    it('Returns deprecation error from codecov_token', () => {
      const args = {
        flags: '',
        verbose: 'true',
      }
      jest.spyOn(console, 'error').mockImplementation(() => {
        // Intentionally empty
      })
      expect(tokenHelpers.getTokenFromYaml(invalidFixturesDir, args)).toBe('')

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("'codecov_token' is a deprecated field"),
      )
    })
  })

  describe('From right source', () => {
    it('Returns from args', () => {
      const inputs: UploaderInputs = {
        args: { token: 'argtoken', flags: '' },
        environment: { CODECOV_TOKEN: 'envtoken' },
      }
      expect(tokenHelpers.getToken(inputs, fixturesDir)).toBe('argtoken')
    })

    it('Returns from env', () => {
      const inputs: UploaderInputs = {
        args: { flags: '' },
        environment: { CODECOV_TOKEN: 'envtoken' },
      }
      expect(tokenHelpers.getToken(inputs, fixturesDir)).toBe('envtoken')
    })

    it('Returns from env', () => {
      const inputs: UploaderInputs = {
        args: { flags: '' },
        environment: {},
      }
      expect(tokenHelpers.getToken(inputs, fixturesDir)).toBe('faketoken')
    })

    it('Returns from no source', () => {
      const inputs: UploaderInputs = {
        args: { flags: '' },
        environment: {},
      }
      expect(tokenHelpers.getToken(inputs, '.')).toBe('')
    })
  })

  it('should return token correctly from args when `-u` differs from default host', () => {
    const inputs: UploaderInputs = {
      args: {
        url: 'dummy.local',
        token: 'goodToken'
      },
      environment: {
        CODECOV_TOKEN: 'badToken'
      }
    }
    expect(tokenHelpers.getToken(inputs, fixturesDir)).toBe('goodToken')
  })

  it('should return token correctly from env when `-u` differs from default host', () => {
    const inputs: UploaderInputs = {
      args: {
        url: 'dummy.local',
      },
      environment: {
        CODECOV_TOKEN: 'goodT----oken'
      }
    }
    expect(tokenHelpers.getToken(inputs, fixturesDir)).toBe('goodT----oken')
  })

  it('should fail validation when an invalid token is passed and host is not changed', () => {
    const inputs: UploaderInputs = {
      args: {
        url: DEFAULT_UPLOAD_HOST
      },
      environment: {
        CODECOV_TOKEN: 'bad------Token'
      }
    }
    expect(() => tokenHelpers.getToken(inputs, fixturesDir)).toThrowError(/Token found by environment variables with length 14 did not pass validation/)
  })
})
