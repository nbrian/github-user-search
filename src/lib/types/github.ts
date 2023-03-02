type User = {
  login: string,
  id: number,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: boolean,
  score: number,
  name: string,
  location: string,
  followers?: number,
  following?: number,
  public_repos?:number
}

type Users = {
  items: Array<User>,
  total_count:number
}

type Repo = {
  id: number,
  name: string,
  full_name: string,
  stargazers_count: number,
  forks_count: number,
}

export type { User, Users, Repo };