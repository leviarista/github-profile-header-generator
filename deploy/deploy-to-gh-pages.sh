#!/usr/bin/env sh

# abort on errors
set -e

# > Install dependencies
npm install
echo 'Dependencies installed'

# > Set config for github pages
cp deploy/vite.config.gh-pages.js vite.config.js
echo 'Setting vite config file for Github Pages'

# build
npm run build
echo 'Build complete'

# > Reset config
cp deploy/vite.config.main.js vite.config.js
echo 'Resetting vite config file'

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:leviarista/github-profile-header-generator.git main:gh-pages

cd -
