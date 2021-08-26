import childProcess from 'child_process'
import { runExternalProgram } from '../helpers/util'
import { validateSHA } from '../helpers/validate'
import { IServiceParams, UploaderEnvs, UploaderInputs } from '../types'

export function detect(envs: UploaderEnvs): boolean {
  return Boolean(envs.CI) && Boolean(envs.BITBUCKET_BUILD_NUMBER)
}

function _getBuild(inputs: UploaderInputs): string {
  const { args, environment: envs } = inputs
  return args.build || envs.BITBUCKET_BUILD_NUMBER || ''
}

// eslint-disable-next-line no-unused-vars
function _getBuildURL(inputs: UploaderInputs): string {
  // TODO: https://github.com/codecov/uploader/issues/267
  return ''
}

function _getBranch(inputs: UploaderInputs): string {
  const { args, environment: envs } = inputs
  return args.branch || envs.BITBUCKET_BRANCH || ''
}

function _getJob(envs: UploaderEnvs): string {
  return envs.BITBUCKET_BUILD_NUMBER || ''
}

function _getPR(inputs: UploaderInputs): number {
  const { args, environment: envs } = inputs
  return Number(args.pr || envs.BITBUCKET_PR_ID || '')
}

function _getService(): string {
  return 'bitbucket'
}

export function getServiceName(): string {
  return 'Bitbucket'
}

function _getSHA(inputs: UploaderInputs): string {
  const { args, environment: envs } = inputs
  let commit = envs.BITBUCKET_COMMIT || ''

  if (commit && validateSHA(commit, 12)) {
    commit = runExternalProgram('git', ['rev-parse', commit])
  }

  return args.sha || commit || ''
}

function _getSlug(inputs: UploaderInputs): string {
  const { args, environment: envs } = inputs

  return args.slug || envs.BITBUCKET_REPO_FULL_NAME || ''
}

export function getServiceParams(inputs: UploaderInputs): IServiceParams {
  return {
    branch: _getBranch(inputs),
    build: _getBuild(inputs),
    buildURL: _getBuildURL(inputs),
    commit: _getSHA(inputs),
    job: _getJob(inputs.environment),
    pr: _getPR(inputs),
    service: _getService(),
    slug: _getSlug(inputs),
  }
}

export function getEnvVarNames(): string[] {
  return ['CI', 'BITBUCKET_BUILD_NUMBER']
}
