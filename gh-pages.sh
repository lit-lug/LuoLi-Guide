#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd dist

if [ -z "$GUIDE_GITHUB_TOKEN" ]; then
  msg='来自手动部署'
  githubUrl=git@github.com:lit-lug/LuoLi-Guide.git
else
  msg='来自github actions的自动部署'
  githubUrl=https://lit-lug:${GUIDE_GITHUB_TOKEN}@github.com/lit-lug/LuoLi-Guide.git
  git config --global user.name "gaoajia"
  git config --global user.email "gaoajia@qq.com"
fi
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl master:gh-pages # 推送到github gh-pages分支

cd -
rm -rf dist/*