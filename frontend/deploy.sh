git checkout master

npm run build

scp -r build/* root@nodejs01.intern.promatis.de:/var/nodejs01.intern.promatis.de

echo "Done!"