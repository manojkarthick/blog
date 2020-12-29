#!/bin/bash

PROJECTS=(
  "manojkarthick/reddsaver"
  "manojkarthick/git-trend"
  "manojkarthick/blog"
  "manojkarthick/dotfiles"
  "manojkarthick/expense-log"
  "manojkarthick/PCRegression"
  "manojkarthick/comictose"
  "manojkarthick/OnBook"
  "manojkarthick/linkdump"
  "manojkarthick/see-hear"
  "manojkarthick/rightfluencer"
)

for project in "${PROJECTS[@]}"; do
  echo "Downloading Github card for $project..."
  base_project_name="${project##*/}"
  wget -q --show-progress --https-only --timestamping "https://gh-card.dev/repos/${project}.svg" -O "src/img/${base_project_name}.svg"
done
