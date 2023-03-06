This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


# Github User Search Demo
--

## Getting Started
To run the app, create a `.env` file on root folder. Follow the format on `.env.example`

- [Generate token on Github](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Create `TOKEN` variable on `.env` file and put the generated token

Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

There are 3 routes to navigate
- search page [http://localhost:3000/](http://localhost:3000/)
- liked page [http://localhost:3000/liked](http://localhost:3000/liked)
- user page [http://localhost:3000/users/[user]](http://localhost:3000/users/octocat)

## Demo
- [Live Demo](https://github-user-search-demo.vercel.app/) 
