. ./env.sh

echo "==========================================================="
echo "Pre-condition: npm run build"
echo "Build and push: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
echo "==========================================================="

total=4
echo "1/$total: try to remove existing image: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
docker rmi ${DOCKER_ACCOUNT}/${IMG}:${VERSION} -f

echo "2/$total: docker build as: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
# ONLY 1 Dockerfile for client
docker build -t ${DOCKER_ACCOUNT}/${IMG}:${VERSION} .

echo "3/$total: docker push: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
docker push ${DOCKER_ACCOUNT}/${IMG}:${VERSION}

echo "4/$total: docker push latest (same content ${DOCKER_ACCOUNT}/${IMG}:${VERSION})"

#JAVA_IMG="mynote-java"
#VERSION=1.1.0
imgId=$(docker images --format "{{.ID}}" --filter=reference="${DOCKER_ACCOUNT}/${IMG}:${VERSION}")
if [ -z "${imgId}" ]; then
    echo "Cannot tag latest"
else
    docker tag ${imgId} ${DOCKER_ACCOUNT}/${IMG}:latest
    docker push ${DOCKER_ACCOUNT}/${IMG}:latest
fi
