git checkout master

npm run build

scp -r build/* root@nodejs01.intern.xxxxxxxx.de:/var/nodejs01.intern.xxxxxxxx.de

echo "Done!"
