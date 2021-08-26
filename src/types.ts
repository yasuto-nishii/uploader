export interface UploaderArgs {
  build?: string // Specify the build number manually
  branch?: string // Specify the branch manually
  dir?: string // Directory to search for coverage reports.
  env?: string // Specify environment variables to be included with this build
  sha?: string // Specify the commit SHA mannually
  file?: string | string[] // Target file(s) to upload
  flags?: string | string[] // Flag the upload to group coverage metrics
  name?: string // Custom defined name of the upload. Visible in Codecov UI
  parent?: string // The commit SHA of the parent for which you are uploading coverage.
  pr?: string // Specify the pull request number mannually
  token?: string // Codecov upload token
  tag?: string // Specify the git tag
  verbose?: string // Run with verbose logging
  rootDir?: string // Specify the project root directory when not in a git repo
  nonZero?: string // Should errors exit with a non-zero (default: false)
  dryRun?: string // Don't upload files to Codecov
  slug?: string // Specify the slug manually (Enterprise use)
  url?: string // Change the upload host (Enterprise use)
  clean?: string // Move discovered coverage reports to the trash
  feature?: string // Toggle features
  source?: string // Track wrappers of the uploader
}

export type UploaderEnvs = NodeJS.Dict<string>

export interface UploaderInputs {
  environment: UploaderEnvs
  args: UploaderArgs
}

export interface IProvider {
  detect: (arg0: UploaderEnvs) => boolean
  getServiceName: () => string
  getServiceParams: (arg0: UploaderInputs) => IServiceParams
  getEnvVarNames: () => string[]
}

export interface IServiceParams {
  branch: string
  build: string
  buildURL: string
  commit: string
  job: string
  pr: number | ''
  service: string
  slug: string
  name?: string
  tag?: string
  flags?: string
  parent?: string
  project?: string
  server_uri?: string
}
