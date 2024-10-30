#!/usr/bin/env bash

# builds the sources. Results are in "dist" folder.

cd client
npm install
cd ..
npm install
gulp build