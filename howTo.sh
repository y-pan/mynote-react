. ./env.sh

echo "==========================================================="
echo "Pre-condition: Spring Boot backend running"
echo "Build and push: ${DOCKER_ACCOUNT}/${IMG}:${VERSION}"
echo "==========================================================="

echo "Check if existing container: ${IMG}:${VERSION}"
# delete same named existing docker container
containerId=$(docker ps | grep "yunkuipan/${IMG}:${VERSION}" | sed "s/\s+*.*$//g")
if [ -z "${containerId}" ]; then
    echo "OK, no existing one."
else
    echo "Found same named docker container ID=${containerId}, will remove it for you."
    docker rm -f ${containerId}
fi

echo "Check if existing img: ${IMG}:${VERSION}"
# delete same named existing docker img
imgId=$(docker images --format "{{.ID}}" --filter=reference="yunkuipan/${IMG}:${VERSION}")
if [ -z "${imgId}" ]; then
    echo "OK, no existing one."
else
    echo "Found same named docker image ID=${id}, will remove it for you."
    docker rmi ${imgId}
fi


echo "Check if existing container: ${IMG}:latest"
# delete same named existing docker container
containerId=$(docker ps | grep "yunkuipan/${IMG}:latest" | sed "s/\s+*.*$//g")
if [ -z "${containerId}" ]; then
    echo "OK, no existing one."
else
    echo "Found same named docker container ID=${containerId}, will remove it for you."
    docker rm -f ${containerId}
fi

echo "Check if existing img: ${IMG}:latest"
# delete same named existing docker img
imgId=$(docker images --format "{{.ID}}" --filter=reference="yunkuipan/${IMG}:latest")
if [ -z "${imgId}" ]; then
    echo "OK, no existing one."
else
    echo "Found same named docker image ID=${id}, will remove it for you."
    docker rmi ${imgId}
fi

echo "Due to login issue, run container (either one) by YOURSELF!"

echo "docker run -d --name ${IMG} -p ${PORT_OUTER}:${PORT_INNER} yunkuipan/${IMG}:${VERSION}"

echo "docker run -d --name ${IMG} -p ${PORT_OUTER}:${PORT_INNER} yunkuipan/${IMG}:latest"

# scp howTo.sh root@pancodes.net:/home/apps/mynote-client
