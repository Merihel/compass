#!/bin/bash

mkdir serverBuild
mkdir serverBuild/src
cp -R src/services serverBuild/src/
cp -R src/utils serverBuild/src/
cp package.json serverBuild/