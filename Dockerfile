FROM kyma/docker-nginx
COPY heatmap/ /var/www
CMD 'nginx'

ENV VIRTUAL_HOST liikkuvatampere.xs.fi
