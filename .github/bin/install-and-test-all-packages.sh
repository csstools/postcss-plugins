# REMOVE this file after node 20 is released and update the test.yml workflow

set -e

start_dir=$(pwd)

for package in $(ls -d ./packages/*); do
	echo "Installing and testing $package"
	cd $package
	npm install --ignore-scripts
	npm run test
	cd $start_dir
done


for package in $(ls -d ./plugins/*); do
	echo "Installing and testing $package"
	cd $package
	npm install --ignore-scripts
	npm run test
	cd $start_dir
done

for package in $(ls -d ./plugin-packs/*); do
	echo "Installing and testing $package"
	cd $package
	npm install --ignore-scripts
	npm run test
	cd $start_dir
done
