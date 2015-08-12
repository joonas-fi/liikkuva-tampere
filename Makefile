NAME = liikkuvatampere_xs_fi
VERSION = 1.0.1

.PHONY: all build

all: build

build:
	docker build -t dkr.xs.fi/$(NAME):$(VERSION) .
