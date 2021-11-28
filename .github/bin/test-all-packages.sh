# REMOVE this file after node 20 is released and update the test.yml workflow

set -e

start_dir=$(pwd)

for package in $(ls -d ./packages/*); do
	echo "Testing $package"
	cd $package
	npm run test
	cd $start_dir
done


for package in $(ls -d ./plugins/*); do
	echo "Testing $package"
	cd $package
	npm run test
	cd $start_dir
done

for package in $(ls -d ./plugin-packs/*); do
	echo "Testing $package"
	cd $package
	npm run test
	cd $start_dir
done
