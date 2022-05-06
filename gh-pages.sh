#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn build

mkdir dist/docs
# 进入docs
cd wiki

yarn install 

yarn build

cp -r docs/.vuepress/dist/* ../dist/docs
# 进入生成的文件夹
cd ../dist

if [ -z "$GUIDE_GITHUB_TOKEN" ]; then
  msg='来自手动部署'
  githubUrl1=git@github.com:lit-lug/LuoLi-Guide.git
  githubUrl2=git@github.com:gaoajia/gh-pages-guode.git
else
  msg='来自github actions的自动部署'
  githubUrl1=https://lit-lug:${GUIDE_GITHUB_TOKEN}@github.com/lit-lug/LuoLi-Guide.git
  githubUrl2=https://gaoajia:${GUIDE_GITHUB_TOKEN}@github.com/gaoajia/gh-pages-guode.git
  git config --global user.name "gaoajia"
  git config --global user.email "gaoajia@qq.com"
fi
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl1 master:gh-pages # 推送到本项目github gh-pages分支
git push -f $githubUrl2 master # 推送到 gaoajia master 分支，用于部署腾讯CND
cd -
rm -rf dist/*