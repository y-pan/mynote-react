. ./env.sh

echo "==========================================================="
echo "Build and push: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
echo "==========================================================="

total=6

echo "1/$total: set prod"
./setProd.sh

echo "1/$total: npm run build"
npm run build

echo "2/$total: try to remove existing image: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
docker rmi ${DOCKER_ACCOUNT}/${IMG}:${VERSION} -f

echo "3/$total: docker build as: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
docker build -t ${DOCKER_ACCOUNT}/${IMG}:${VERSION} .

#exit

echo "4/$total: docker push: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
docker push ${DOCKER_ACCOUNT}/${IMG}:${VERSION}

echo "5/$total: docker push latest (same content ${DOCKER_ACCOUNT}/${IMG}:${VERSION})"

#JAVA_IMG="mynote-java"
#VERSION=1.1.0
imgId=$(docker images --format "{{.ID}}" --filter=reference="${DOCKER_ACCOUNT}/${IMG}:${VERSION}")
if [ -z "${imgId}" ]; then
    echo "Cannot tag latest"
else
    docker tag ${imgId} ${DOCKER_ACCOUNT}/${IMG}:latest
    docker push ${DOCKER_ACCOUNT}/${IMG}:latest
fi

echo "6/$total: copy env.sh, howTo.sh to remote."
scp howTo.sh root@pancodes.net:/home/apps/mynote-client
scp env.sh root@pancodes.net:/home/apps/mynote-client
