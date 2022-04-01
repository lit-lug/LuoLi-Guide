#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

if [ -z "$GUIDE_WIKI_GITHUB_TOKEN" ]; then
  msg='deploy'
  githubUrl1=git@github.com:lit-lug/LuoLi-Guide-wiki.git
  githubUrl2=git@github.com:gaoajia/gh-pages-guode-docs.git
else
  msg='来自github actions的自动部署'
  githubUrl1=https://lit-lug:${GUIDE_WIKI_GITHUB_TOKEN}@github.com/lit-lug/LuoLi-Guide-wiki.git 
  githubUrl2=https://gaoajia:${GUIDE_WIKI_GITHUB_TOKEN}@github.com/gaoajia/gh-pages-guode-docs.git
  git config --global user.name "gaoajia"
  git config --global user.email "gaoajia@qq.com"
fi

git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl1 master:gh-pages # 推送到github gh-pages分支
git push -f $githubUrl2 master # 推送到 gaoajia master 分支，用于部署腾讯CND

cd -
rm -rf docs/.vuepress/dist